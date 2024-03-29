import React, { useState, useMemo } from "react";
import styles from "./ClientList.module.scss";
import { Pagination, Table } from "react-bootstrap";
import { TiCancelOutline } from "react-icons/ti";
import usePagination from "../../hooks/usePagination";
import { Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import Button from "../Button/Button";

const ClientList = ({ clientList, role, handleBtnClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  // eslint-disable-next-line no-unused-vars
  const [pageNumberLimit, setpageNumberLimit] = useState(3);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(3);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const {
    currentList,
    items,
    goToNextPage,
    goToPrevPage,
    incrementBtn,
    decrementBtn,
  } = usePagination(
    currentPage,
    postsPerPage,
    clientList,
    setCurrentPage,
    styles,
    maxPageNumberLimit,
    minPageNumberLimit,
    setmaxPageNumberLimit,
    setminPageNumberLimit,
    pageNumberLimit
  );

  const detailRoutePrefix = useMemo(() => {
    if (role === "sales") {
      return "sales-agent";
    } else if (role === "super") {
      return "super-admin";
    } else {
      return role;
    }
  }, [role]);

  return (
    <>
      <div className={styles.welcomeGroup}>
        <div>
          <h2>{role !== "super" ? `Clients` : `Staffs`}</h2>
          <p className={styles.currentDate}>
            Today is {moment().format("dddd Do[,] MMMM")}.
          </p>
        </div>
        {role === "super" && (
          <Button
            className={styles.addBtn}
            bgColor="#741763"
            color="#fff"
            size="lg"
            clicked={handleBtnClick}
          >
            Add New
          </Button>
        )}
      </div>
      <div className={styles.overview}>
        <div className={styles.overviewBox}>
          <h3>{`${role !== "super" ? "Clients" : "Staff"} Overview`}</h3>
          <Table striped className={styles.table}>
            <thead>
              <tr>
                <th>{`${role !== "super" ? "Client" : "Staff"} Name`}</th>
                <th>{`${role !== "super" ? "Client" : "Staff"} ID`}</th>
                <th>Phone Number</th>
                <th>{role !== "super" ? `BVN` : `Role`}</th>
                <th>Date Created</th>
              </tr>
            </thead>
            {currentList && currentList.length > 0 ? (
              <tbody>
                {currentList.map((client, idx) => (
                  <tr>
                    <td>{`${_.capitalize(client.firstName)} ${_.capitalize(
                      client.lastName
                    )}`}</td>
                    <td className={styles.loanId}>
                      <Link to={`/${detailRoutePrefix}/client/${client._id}`}>
                        {client._id.slice(0, 6)}
                      </Link>
                    </td>
                    <td>{client.phoneNumber.replace("234", "0")}</td>
                    {role !== "super" ? (
                      <td>{client?.more_info[0]?.bioData?.BVN || "-----"}</td>
                    ) : (
                      <td>{_.startCase(client?.role)}</td>
                    )}
                    <td>{moment(client.createdAt).format("lll")}</td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </Table>
          {currentList && currentList.length === 0 ? (
            <div className={styles.nullList}>
              <TiCancelOutline size="6em" color="rgba(116, 23, 99, 0.6)" />
            </div>
          ) : null}
          {currentList && currentList.length > 0 ? (
            <div className={styles.tableFooter}>
              <div className={styles.rowsInput}>
                <p>Rows per page: </p>
                <select
                  onChange={(e) =>
                    setPostsPerPage(Number(e.currentTarget.value))
                  }
                >
                  <option value={5} selected>
                    5
                  </option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={10}>25</option>
                  <option value={30}>30</option>
                </select>
              </div>
              <Pagination className={styles.pagination}>
                <Pagination.Prev
                  onClick={currentPage === items[0] ? null : goToPrevPage}
                />
                {decrementBtn}
                {items}
                {incrementBtn}
                <Pagination.Next
                  onClick={
                    currentPage === items[items.length - 1]
                      ? null
                      : goToNextPage
                  }
                />
              </Pagination>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ClientList;
