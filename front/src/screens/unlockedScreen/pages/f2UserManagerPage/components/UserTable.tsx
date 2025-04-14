import styled from "@emotion/styled";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip, TableContainer } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useConstants } from "@/providers/constants";
import { AccessLevels, AccountStatus } from "../typings";
import { ActiveIcon, InactiveIcon } from "../assets";
import { Languages, useSettings } from "../../../../../providers";

const TableWrapper = styled(TableContainer)`
  border-radius: 15px;
  overflow: auto;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 50vh;
`;

const StyledTableHead = styled(TableHead)`
  & th {
    color: white;
    font-weight: 700;
  }
`;

const StyledTableRow = styled(TableRow)`
  & td {
    color: white;
    border-color: #ffffff0d;
  }
`;

export const UserTable: FC = () => {
  const { t } = useTranslation("UserManagerPage");
  const { settings } = useSettings();
  const appConstants = useConstants();

  const users = appConstants.unlockedScreen.userManager.USERS;
  const isEnglish = settings.language === Languages.EN;

  return (
    <TableWrapper>
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell style={{ paddingLeft: "2vw" }}>
              <Typography variant="tableContent">{t("table.id")}</Typography>
            </TableCell>
            {isEnglish ? (
              <>
                <TableCell>
                  <Typography variant="tableContent">{t("table.firstName")}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="tableContent">{t("table.lastName")}</Typography>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell>
                  <Typography variant="tableContent">{t("table.lastName")}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="tableContent">{t("table.firstName")}</Typography>
                </TableCell>
              </>
            )}
            <TableCell>
              <Typography variant="tableContent">{t("table.password")}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="tableContent">{t("table.accessLevel")}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="tableContent">{t("table.accountStatus")}</Typography>
            </TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {users.map((user) => (
            <StyledTableRow key={user.id}>
              <TableCell style={{ paddingLeft: "2vw" }}>{user.id}</TableCell>
              {isEnglish ? (
                <>
                  <TableCell>
                    <Typography variant="tableContent">{user.firstName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="tableContent">{user.lastName} </Typography>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>
                    <Typography variant="tableContent">{user.lastName} </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="tableContent">{user.firstName}</Typography>
                  </TableCell>
                </>
              )}
              <TableCell>
                <Typography variant="tableContent">{"*".repeat(user.password.length)}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={
                    <Typography variant="chipLabel" style={{ padding: 5 }}>
                      {t(`table.accessLevels.${user.accessLevel}`)}
                    </Typography>
                  }
                  color={user.accessLevel === AccessLevels.SECURITY_GUARD ? "primary" : "secondary"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {user.accountStatus === AccountStatus.ACTIVE ? (
                    <img src={ActiveIcon} alt="activeIcon" style={{ marginRight: 10, width: "1vw" }} />
                  ) : (
                    <img src={InactiveIcon} alt="inactiveIcon" style={{ marginRight: 10, width: "1vw" }} />
                  )}
                  <Typography variant="tableContent" style={{ padding: "5px 0 0 0" }}>
                    {t(`table.accountStatuses.${user.accountStatus}`)}
                  </Typography>
                </div>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};
