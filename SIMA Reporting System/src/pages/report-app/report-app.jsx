import React from "react";
import { useEffect, useMemo, useState } from "react";
import TableComponent from "../../components/shared/table-component/table-component";
import TableHeader from "../../components/shared/table-component/table-header";
import Pagination from "../../components/shared/pagination/pagination";
import { NavLink, useParams } from "react-router-dom";
import { getallReportApps, getallReports } from "../../core/api";
import stroke from "../../assets/images/common/stroke.png";
import { useNavigate } from "react-router-dom";
import { Link, useMatches } from "react-router-dom";

const ReportApp = ({ setReturnedItemFunc, ...props }) => {
  const PageSize = process.env.REACT_APP_PAGE_SIZE;
  let navigate = useNavigate();
  const excludedHeader = ["url", "id", "reportAppId", "reportId"];
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [reports, setReports] = useState([]);
  const [noFilter, setNoFilter] = useState(true);
  const [searchData, setSearchData] = useState([]);
  const [title, setTitle] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    getReportAppByReportId(id);
  }, []);
  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    const response = await getallReports();
    // console.log(response);
    setTitle(response.data.filter((dt) => dt.id == id).map((dt) => dt.agency));
  };

  const getReportAppByReportId = async (id) => {
    const response = await getallReportApps(id);
    // console.log(response);
    setReports(
      response.data
        .filter((dt) => dt.reportId == id)
        .map((dt) => ({
          ...dt,
          render: () => (
            <NavLink
              onClick={(e) => {
                e.preventDefault();
                navigate(`/report/app/detail/${dt.id}`);
              }}
            >
              Keçid et <img src={stroke} />
            </NavLink>
          ),
        }))
    );
  };

  const currentTableData = useMemo(() => {
    let filterData = reports;

    if (searchValue) {
      filterData = [
        ...filterData.filter((item) => {
          return item.serviceName
            ?.toLowerCase()
            .includes(searchValue?.toLowerCase());
        }),
      ];
    }
    setSearchData(filterData);
    setTotalCount(filterData.length);
    // console.log(filterData + "e");

    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filterData.slice(firstPageIndex, lastPageIndex);
  }, [reports, searchValue, currentPage]);
  // console.log(reports);
  return (
    <div className="container__page">
      <TableHeader
        setSearchValue={setSearchValue}
        setCurrentPage={setCurrentPage}
        placeholder={"Xidmət-ə görə axtar..."}
        searchValue={searchValue}
        noFilter={noFilter}
      />
      <nav className="bread-crumbs">
        <Link onClick={() => navigate(-1)}>&#10094; Geri</Link> /
        <Link className="bread-crumbs--active">Qurum</Link>
      </nav>
      <h5 className="agency-title">{title}</h5>
      <TableComponent
        data={currentTableData}
        excluded={excludedHeader}
        searchData={searchData}
      ></TableComponent>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ReportApp;
