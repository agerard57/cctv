import { Fragment, JSX, ReactNode, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import styled from "@emotion/styled";
import { useKeyDown } from "../../../providers/keyState/hooks";
import { BlackContainerBase } from "../styles";
import { Chart, registerables } from "chart.js";
import { useTranslation } from "react-i18next";
import { ControlCenterPageSections, SettingsPageSections } from "../pages";

Chart.register(...registerables);

interface Category<T = string> {
  categoryName: T;
  content?: ReactNode;
}

interface CategoryLayoutProps<T = string> {
  categories: Category<T>[];
  namespace: string;
}

const WhiteContainerBase = styled.div<{ background: string }>`
  backdrop-filter: blur(10px);
  background: ${({ background }) => background};
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
})<{ isSelected: boolean }>`
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
  const [selectedCategory, setSelectedCategory] = useState<T | undefined>(categories[0]?.categoryName || undefined);
  const theme = useTheme();
  const { t } = useTranslation(namespace);

  // Find the current index for navigation purposes
  const selectedIndex = categories.findIndex((c) => c.categoryName === selectedCategory);

  const handleCategoryNavigation = (direction: "up" | "down") => {
    // Start from current index and find next/prev valid category with content
    let currentIndex = selectedIndex < 0 ? 0 : selectedIndex;
    let newIndex = currentIndex;

    // Find the next category with content
    for (let i = 0; i < categories.length; i++) {
      // Calculate the next potential index using modulo for wrap-around
      const tempIndex =
        direction === "down"
          ? (currentIndex + i + 1) % categories.length
          : (currentIndex - i - 1 + categories.length) % categories.length;

      // If this category has content, select it
      if (categories[tempIndex].content && tempIndex !== currentIndex) {
        newIndex = tempIndex;
        break;
      }
    }

    // Only update if we found a different category
    if (newIndex !== currentIndex) setSelectedCategory(categories[newIndex].categoryName);
  };

  // TODO Remove SupportedKeys from all useKeyDown
  useKeyDown(
    {
      PageDown: () => handleCategoryNavigation("down"),
      PageUp: () => handleCategoryNavigation("up"),
    },
    undefined,
    [selectedCategory],
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        borderRadius: 15,
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
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
                  (category.categoryName as SettingsPageSections) === SettingsPageSections.SYSTEM_CONFIGURATION
                    ? "red"
                    : category.content
                      ? "inherit"
                      : "grey",
              }}
            >
              {t(`${category.categoryName}.title`)}
            </CategoryText>
            {index !== categories.length - 1 && <hr style={{ opacity: 0.1 }} />}
          </Fragment>
        ))}
      </SidebarContainer>

      {/* Content Area */}
      <WhiteContainerBase background={theme.app.core.whiteTransparentBackground}>
        <Typography variant="pageTitle">{t(`${selectedCategory}.title`)}</Typography>
        <Box marginTop={2}>{categories.find((c) => c.categoryName === selectedCategory)?.content}</Box>
      </WhiteContainerBase>
    </div>
  );
};
