import React, { useMemo, useState } from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';
import styles from './ClientListPage.module.scss';
import { routes } from '../../routes/sidebarRoutes';
import { useLocation,Link } from 'react-router-dom';
import moment from 'moment';
import  Button from '../../components/Button/Button';
import { Table, Pagination } from 'react-bootstrap';
import { clientList } from '../../utils/dummyData';


const ClientListPage = () => {

  const location = useLocation();
  const salesRoute = routes[1];

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  const indexOfLastClient = useMemo(() => {
    return currentPage * postsPerPage
  }, [currentPage, postsPerPage]);

  const indexOfFirstClient = useMemo(() => {
    return indexOfLastClient - postsPerPage
  }, [indexOfLastClient, postsPerPage]);

  const currentClients = useMemo(() => {
    return clientList.slice(indexOfFirstClient, indexOfLastClient);
  }, [indexOfLastClient, indexOfFirstClient])

  const goToPage = (event) => {
    if(event.target.text) {
      setCurrentPage(Number(event.target.text));
    }
  }

  let items = [];

  for (let i=1; i <= Math.ceil(clientList.length / postsPerPage); i++) {
    items.push(
      <Pagination.Item onClick={goToPage} key={i} active={i === currentPage}>
        {i}
      </Pagination.Item>
    )
  }

  const goToPrevPage = () => {
    if(currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const goToNextPage = () => {
    if(currentPage < Math.ceil(clientList.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <Dashboard sidebarRoutes={salesRoute} location={location}>
      <div className={styles.welcomeGroup}>
        <div>
          <h2>Clients</h2>
          <p className={styles.currentDate}>Today is {moment().format('dddd Do[,] MMMM')}.</p>
        </div>
        <Button
          size="sm" 
          bgColor="#741763" 
          color="#fff"
        >
          Onboard New Client
        </Button>
      </div>
      <div className={styles.overview}>
        <div className={styles.overviewBox}>
          <h3>Clients Overview</h3>
          <Table className={styles.table}>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Client ID</th>
                <th>Phone Number</th>
                <th>BVN</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              { currentClients.map((client, idx) => (
                <tr>
                  <td>{client.clientName}</td>
                  <td className={styles.loanId}>
                    <Link to='/sales-agent/client/general'>{client.loanId}</Link>
                  </td>
                  <td>{client.phoneNo}</td>
                  <td>{client.bvn}</td>
                  <td>{client.dateCreated}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className={styles.tableFooter}>
            <div className={styles.rowsInput}>
              <p>Rows per page: </p>
              <select onChange={(e) => setPostsPerPage(Number(e.currentTarget.value))}>
                <option value={5} selected>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={10}>25</option>
                <option value={30}>30</option>
              </select>
            </div>
            <Pagination className={styles.pagination}>
              <Pagination.Prev onClick={goToPrevPage}/>
              {items}
              <Pagination.Next onClick={goToNextPage} />
            </Pagination>
          </div>
        </div>
      </div>
    </Dashboard>
  )
}


export default ClientListPage;