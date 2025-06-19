import { Fragment, JSX, ReactNode, useState, isValidElement, ReactElement } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import styled from "@emotion/styled";
import { useKeyDown } from "../../../providers/keyState/hooks";
import { BlackContainerBase } from "@/core";
import { Chart, registerables } from "chart.js";
import { useTranslation } from "react-i18next";
import { ControlCenterPageSections, SettingsPageSections } from "../pages";
import { WhiteContainerBase } from "../styles";

Chart.register(...registerables);

interface Category<T = string> {
  categoryName: T;
  content?: ReactNode;
  dialog?: ReactNode;
}

interface CategoryLayoutProps<T = string> {
  categories: Category<T>[];
  namespace: string;
}

const ContentContainer = styled(WhiteContainerBase)`
  flex: 1;
  padding: 2%;
`;

const SidebarContainer = styled(BlackContainerBase)`
  padding: 20px;
  width: 18vw;

  flex: 0 0 auto; /* Don't grow, don't shrink, use auto basis */
`;

const CategoryText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isSelected",
}) <{ isSelected: boolean }>`
  padding: 15px;
  opacity: ${(props) => (props.isSelected ? 1 : 0.6)};
  font-weight: ${(props) => (props.isSelected ? 700 : 400)}; /* Use numeric values for consistency */
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CategoryLayout = <T extends ControlCenterPageSections | SettingsPageSections>({
  categories,
  namespace,
}: CategoryLayoutProps<T>): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<T | undefined>(categories[0]?.categoryName);
  const theme = useTheme();
  const { t } = useTranslation(namespace);

  const selectedIndex = categories.findIndex((c) => c.categoryName === selectedCategory);

  const handleCategoryNavigation = (direction: "up" | "down") => {
    let currentIndex = selectedIndex < 0 ? 0 : selectedIndex;
    let newIndex = currentIndex;

    for (let i = 0; i < categories.length; i++) {
      const tempIndex =
        direction === "down"
          ? (currentIndex + i + 1) % categories.length
          : (currentIndex - i - 1 + categories.length) % categories.length;

      if (categories[tempIndex].content && tempIndex !== currentIndex) {
        newIndex = tempIndex;
        break;
      }
    }

    if (newIndex !== currentIndex) setSelectedCategory(categories[newIndex].categoryName);
  };

  useKeyDown(
    {
      PageDown: () => handleCategoryNavigation("down"),
      PageUp: () => handleCategoryNavigation("up"),
    },
    undefined,
    [selectedCategory],
  );

  const selectedCategoryData = categories.find((c) => c.categoryName === selectedCategory);

  const dialogElement = selectedCategoryData?.dialog;
  const dialogOpen =
    isValidElement(dialogElement) &&
    Boolean((dialogElement as ReactElement<{ open?: boolean }>).props.open);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        borderRadius: 15,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <SidebarContainer>
        {categories.map((category, index) => (
          <Fragment key={category.categoryName}>
            <CategoryText
              isSelected={selectedCategory === category.categoryName}
              sx={{
                cursor: category.content ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color:
                  category.dialog && dialogOpen
                    ? "#f54842"
                    : category.content
                      ? "white"
                      : "grey",
              }}
            >
              {t(`${category.categoryName}.title`)}
            </CategoryText>
            {index !== categories.length - 1 && <hr style={{ opacity: 0.1 }} />}
          </Fragment>
        ))}
      </SidebarContainer>

      <ContentContainer background={theme.app.core.whiteTransparentBackground}>
        <Typography variant="pageTitle">{t(`${selectedCategory}.title`)}</Typography>
        <Box marginTop={2}>{selectedCategoryData?.content}</Box>
        {dialogOpen && (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.81)",
                zIndex: 1,
              }}
            />
            <Box
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "60%",
                padding: "5vh",
                backgroundColor: "rgba(61, 19, 19, 0.88)",
                borderRadius: 8,
                boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                maxWidth: 600,
                zIndex: 10,
              }}
            >
              {dialogElement}
            </Box>
          </>
        )}
      </ContentContainer>
    </div>
  );
};
