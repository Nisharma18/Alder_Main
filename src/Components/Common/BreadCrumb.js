// import React from 'react';
// import { Link,useLocation } from 'react-router-dom';

// const BreadCrumb = ({ title, pageTitle, buttons }) => {
//     // const location = useLocation();
//     // const pathSegments = location.pathname.split('/').filter(segment => segment !== '');

//     // // Construct breadcrumb items dynamically based on the current path
//     // const breadcrumbItems = pathSegments.map((segment, index) => {
//     //     const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
//     //     return { title: segment, link: path };
//     // });
//     return (
//         <div className="page-title-box d-flex align-items-center justify-content-between">
//             <div>
//                 <h4 className="mb-sm-0">{title}</h4>
//                 <div className="page-title-right">
//                     <ol className="breadcrumb m-0">
//                         <li className="breadcrumb-item " style={{ fontSize: "11px" }}><Link to="#">{pageTitle}</Link></li>
//                         <li className="breadcrumb-item active" style={{ fontSize: "11px" }}>{title}</li>
//                     </ol>
//                 </div>
//             </div>
//             {buttons}
//         </div>
//     );
// };

// export default BreadCrumb;









import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import OrderSearch from '../../pages/ManageOrder/OrderSearch';

const BreadCrumb = ({ 
    title, 
    pageTitle, 
    subTitle,
    btnPage, 
    buttons , 
    pageName,
    manageProduct,
    orderSearch,
    managePi,
    vendorCreate,

}) => {
    return (
        <div className="page-title-box d-flex align-items-center justify-content-between">
            <div>
                <h4 className="mb-sm-0">{pageName}</h4>
                <div className="page-title-right">
                <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item" style={{ fontSize: "11px" }}><Link to="/dashboard">Home</Link></li>
                        {title && <li className="breadcrumb-item" style={{ fontSize: "11px" }}><Link to="#">{title}</Link></li>}
                        {manageProduct && <li className="breadcrumb-item active" style={{ fontSize: "11px" }}> <Link to="/product-search">{manageProduct}</Link></li>}
                        {orderSearch && <li className="breadcrumb-item active" style={{ fontSize: "11px" }}> <Link to="/order-search">{orderSearch}</Link></li>}
                        {managePi && <li className="breadcrumb-item active" style={{ fontSize: "11px" }}> <Link to="/proforma-Invoice">{managePi}</Link></li>}
                        {vendorCreate && <li className="breadcrumb-item active" style={{ fontSize: "11px" }}> <Link to="/vendor">{vendorCreate}</Link></li>}
                        {pageTitle && <li className="breadcrumb-item active" style={{ fontSize: "11px" }}> 
                        <Link to="/company-search">{pageTitle} </Link>
                        </li>}
                        {subTitle && <li className="breadcrumb-item active" style={{ fontSize: "11px" }}>{subTitle}</li>}
                        {btnPage && <li className="breadcrumb-item active" style={{ fontSize: "11px" }}>{btnPage}</li>}
                       
                    </ol>
                </div>
            </div>
            {buttons}
        </div>
    );
};

export default BreadCrumb;




