import React, { useState, useCallback } from 'react';
import { Col, Container, Row, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, Label, FormGroup, Input } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import Select from 'react-select';
import Navdata from '../../Layouts/LayoutMenuData';
import './permission.css';
export default function PermissionPage() {
    const [userList, setUserList] = useState();
    const [checkedData, setCheckedData] = useState([]);
    const [conditionallyAssigning, setConditionallyAssigning] = useState()
    const [naveData, setNaveData] = useState()
    const [navIds, setNavIds] = useState([[]])
    const [dummyData] = useState([
        {
            id: 1,
            permissionName: "Master",
            subModule: [
                { id: 1, subModuleName: "Category" },
                { id: 2, subModuleName: "Color" },
                { id: 3, subModuleName: "Finish" },
            ]
        },
        {
            id: 2,
            permissionName: "MIS",
            subModule: [
                { id: 1, subModuleName: "Inventory Register" },
                { id: 2, subModuleName: "Inventory Issue Register" },
                { id: 3, subModuleName: "Part Inventory" },
            ]
        },
        {
            id: 3,
            permissionName: "Part",
            subModule: []
        },
    ]);
    let menuItems = [];
    const navData = Navdata().props.children;
    navData.forEach(function (value, key) {
        menuItems.push(value);
    });


    const handleGetPermissionIds = useCallback((data) => {
        setCheckedData(prevData => {
            const updatedData = [...prevData];
            const dataIndex = updatedData.findIndex(item => item.id === data.parentData.id);

            if (data.id) {
                if (dataIndex !== -1) {
                    if (!updatedData[dataIndex].subModuleIds.includes(data.id)) {
                        updatedData[dataIndex].subModuleIds.push(data.id);
                    } else {
                        updatedData[dataIndex].subModuleIds = updatedData[dataIndex].subModuleIds.filter(id => id !== data.id);
                        if (!updatedData[dataIndex].subModuleIds.length) {
                            updatedData.splice(dataIndex, 1);
                        }
                    }
                } else {
                    updatedData.push({
                        id: data.parentData.id,
                        permissionName: data.parentData.permissionName,
                        subModuleIds: [data.id]
                    });
                }
            } else {
                if (dataIndex !== -1) {
                    updatedData.splice(dataIndex, 1);
                } else {
                    updatedData.push({
                        id: data.parentData.id,
                        permissionName: data.parentData.permissionName,
                        subModuleIds: []
                    });
                }
            }
            return updatedData;
        });
    }, []);


    const renderAssigningSelect = () => {
        return (
            <Select value={conditionallyAssigning} options={[{ label: "Assign module", value: "Assign module" }, { label: "Assign Page", value: "Assign Page" }]} placeholder="Assign..." onChange={(e) => setConditionallyAssigning(e)} />
        );
    };
    return (
        <div className="page-content" style={{ overflow: "hidden", paddingBottom: "100px" }}>
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <BreadCrumb title="Permission" pageTitle="Master" />
                    </Col>
                    <Col lg={4}>
                        <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            {renderAssigningSelect()}
                        </div>
                    </Col>
                    {
                        conditionallyAssigning?.label == "Assign Page" ? <Col lg={4}>
                            <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                                <Select value={naveData} options={[
                                    { id: "Company", label: "Company" },
                                    { id: "Color", label: "Color" },
                                ]} placeholder="Pages.." onChange={(e) => setNaveData(e)} />
                            </div> </Col> : ""
                    }

                    {conditionallyAssigning?.label == "Assign module" ? <Col lg={4}>
                        <div style={{ border: "1px solid #ced4da", borderRadius: "4px" }}>
                            <Select value={userList} options={[{ label: "Tushar", value: "Tushar" }, { label: "Tushar1 ", value: "Tusha1r" }]} placeholder="User List..." onChange={(e) => setUserList(e)} />
                        </div>
                    </Col> : ''}
                    {conditionallyAssigning?.label == "Assign module" ? <Col lg={12}>
                        <UncontrolledAccordion
                            stayOpen
                            style={{ border: "1px solid #ced4da", borderRadius: "4px", margin: "20px 0 " }}
                        >
                            {dummyData.map(({ permissionName, subModule, id }) => (
                                <AccordionItem key={id}>
                                    <AccordionHeader targetId={id}>
                                        {subModule.length ? permissionName : (
                                            <FormGroup>
                                                <Label check style={{ cursor: "pointer" }} for={`${permissionName}`}>
                                                    {permissionName}
                                                    <Input
                                                        id={`${permissionName}`}
                                                        style={{ marginLeft: "10px" }}
                                                        type="checkbox"
                                                        checked={checkedData.map(item => item.id).includes(id)}
                                                        onChange={() => handleGetPermissionIds({ parentData: { id, permissionName } })}
                                                    />
                                                </Label>
                                            </FormGroup>
                                        )}
                                    </AccordionHeader>
                                    <AccordionBody accordionId={id}>
                                        {subModule.map(data => (
                                            <FormGroup key={data.id}>
                                                <Label check style={{ cursor: "pointer" }} for={`${data.subModuleName}`}>
                                                    <Input
                                                        id={`${data.subModuleName}`}
                                                        style={{ marginRight: "10px" }}
                                                        type="checkbox"
                                                        checked={checkedData.some(item => item.id === id && item.subModuleIds.includes(data.id))}
                                                        onChange={() => handleGetPermissionIds({ ...data, parentData: { id, permissionName } })}
                                                    />
                                                    {data.subModuleName}
                                                </Label>
                                            </FormGroup>
                                        ))}
                                    </AccordionBody>
                                </AccordionItem>
                            ))}
                        </UncontrolledAccordion>
                    </Col> : ''}

                    {conditionallyAssigning?.label == "Assign Page" ?
                        naveData && <Col lg={12}>
                            <UncontrolledAccordion
                                defaultOpen={[1]}
                                stayOpen
                                style={{ border: "1px solid #ced4da", borderRadius: "4px", margin: "20px 0 " }}
                            >
                                <AccordionItem >
                                    <AccordionHeader targetId={1}>
                                        {naveData.label}
                                    </AccordionHeader>
                                    <AccordionBody accordionId={1}>

                                        {
                                            ["Tushar", "Ravi"].map((item) => {
                                                return (
                                                    <FormGroup key={item}>
                                                        <Label check style={{ cursor: "pointer" }} for={item}>
                                                            <Input
                                                                id={item}
                                                                style={{ marginRight: "10px" }}
                                                                type="checkbox"
                                                            // checked={checkedData.some(item => item.id === id && item.subModuleIds.includes(data.id))}
                                                            // onChange={() => handleGetPermissionIds({ ...data, parentData: { id, permissionName } })}
                                                            />
                                                            {item}
                                                        </Label>
                                                    </FormGroup>
                                                )
                                            })
                                        }
                                    </AccordionBody>
                                </AccordionItem>
                            </UncontrolledAccordion>
                        </Col>
                        : ""
                    }
                </Row>
            </Container>
        </div >
    );
}
