import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Button,
  ModalFooter,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import cartimage from "./../../assets/Alderimages/Addtocart.jpg";
import Token from "../Token/Base_Token";
import image from "./../../assets/images/about.jpg";
import url from "../Base_url/Base_url";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import {useLocation } from 'react-router-dom';

const Catalogue = () => {
  const [Filter, setFilter] = useState();
  const [prdname, setPrdname] = useState(false);
  const [ProductAlias, setProductAlias] = useState(false);
  const [category, setCategory] = useState(false);
  const [color, setColor] = useState(false);
  const [finish, setFinish] = useState(false);  
  
  const [cataloguedata, setCataloguedata] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [modalProject, setModalProject] = useState(false);
  const [actino, setAction] = useState({
    label: "Create Collection",
    value: "Create Collection",
  });
  
  
  const [buyerSearchCompleted, setBuyerSearchCompleted] = useState(false);
  const [buyername, setBuyername] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [temptable, setTemptable] = useState([]);
  const [saveCollection, setSaveCollection] = useState([{}]);

  const [prdalias, setPrdalias] = useState([]);
  const [description, setDiscription] = useState([]);
  const[allCategory,setAllCategory]=useState([])
  const[allColor,setAllColor]=useState([])
  const[allFinish,setAllFinish]=useState([])
  const [buyer, setBuyer] = useState([]);
  const [table, setTable] = useState([]);
  const [tempupdate, setTempupdate] = useState([]);
  const location = useLocation();

  const[prdnmoption,setPrdnmoption]=useState();
  const[prdcoloroption,setPrdcoloroption]=useState();
  const[prdfinishoption,setPrdfinishoption]=useState();
  const[prdaliasoption,setPrdaliasoption]=useState();
  const[prdcatoption,setPrdcatoption]=useState();
  const[buyernameoption,setBuyernameoption]=useState()


  

  const isItemAdded = (index) => {
      return addedItems.some((item) => item.rwid === index);
  };

    useEffect(() => {
        const buyersearch = async () => {
            const response = await fetch(`${url}/getAllLedger`, { headers: { Authorization: Token } });
            const Buyer = await response.json();
            const buyerNames = Buyer.filter((item) => item.partytype === 'Buyer').map((item) => item.lednm);
            setBuyername(buyerNames);
            setBuyerSearchCompleted(true);
        };
        buyersearch();
    }, []);


  const Filters = [
    {
      options: [
        { label: "Prouct Name", value: "ProductName" },
        { label: "Prouct Alias", value: "Prouctalias" },
        { label: "Category", value: "Category" },
        { label: "Color", value: "Color" },
        { label: "Finish", value: "Finish" },
      ],
    },
  ];

  const Action = [
    {
      options: [
        { label: "Create Collection", value: "Create Collection" },
        { label: "Update Collection", value: "Update Collection" },
      ],
    },
  ];

  const Buyername = [
    {
      options: [
        { label: "", value: "" }, 
        ...buyername.map((item) => {
          return { label: item, value: item };
        }),
      ],
    },
  ];

  const AllPRDAlias = [
    {
      options: [
        { label: "", value: "" }, 
        ...prdalias.map((item) => {
          return { label: item.alias, value: item.alias };
        }),
      ],
    },
  ];

  const AllDescription = [
    {
      options: [
        { label: "", value: "" }, 
        ...description.map((item) => {
          return { label: item.prdnm, value: item.prdnm };
        }),
      ],
    },
  ];

  const AllCategories = [
    {
      options: [
        { label: "", value: "" }, 
        ...allCategory.map((item) => {
          return { label: item.catnm, value: item.catnm };
        }),
      ],
    },
  ];

  const AllColor = [
    {
      options: [
        { label: "", value: "" }, 
        ...allColor.map((item) => {
          return { label: item.color, value: item.color };
        }),
      ],
    },
  ];

  const AllFinish = [
    {
      options: [
        { label: "", value: "" }, 
        ...allFinish.map((item) => {
          return { label: item.finish, value: item.finish };
        }),
      ],
    },
  ];


  function handleMulti2(e) {
    setFilter(e);

    const hasProduct = e.some((item) => item.value.trim() === "ProductName");
    const hasProduct2 = e.some((item) => item.value.trim() === "Prouctalias");
    const hasProduct3 = e.some((item) => item.value.trim() === "Category");
    const hasProduct4 = e.some((item) => item.value.trim() === "Color");
    const hasProduct5 = e.some((item) => item.value.trim() === "Finish");

    if (hasProduct) {
      setPrdname(true);
    } else {
      setPrdname(false);
    }

    if (hasProduct2) {
      setProductAlias(true);
    } else {
      setProductAlias(false);
    }

    if (hasProduct3) {
      setCategory(true);
    } else {
      setCategory(false);
    }

    if (hasProduct4) {
      setColor(true);
    } else {
      setColor(false);
    }

    if (hasProduct5) {
      setFinish(true);
    } else {
      setFinish(false);
    }
  }

  const handleButtonClick = (id) => {
    setButtonClicked((prevClicked) => ({
      ...prevClicked,
      [id]: !prevClicked[id],
    }));

    setAddedItems((prevItems) => {
      const itemExists = prevItems.some((item) => item.rwid === id);
      if (itemExists) {
        toast.success("item removed", { autoClose: 1000 });
        return prevItems.filter((item) => item.rwid !== id);
      } else {
        const row = cataloguedata.find((row) => row.rwid === id);
        toast.success("item Added", { autoClose: 1000 });
        if (row) {
          return [...prevItems, row];
        }
      }

      return prevItems;
    });
  };

  const handleAddToList = () => {
    if (addedItems.length === 0) {
      toast.error("There is No items", { autoClose: 1000 });
    } else {
      const itemsToAdd = selectedItems.filter((item) => !isItemAdded(item));
      const newAddedItems = itemsToAdd.map((item) => {
        const selectedRow = cataloguedata.find((row) => row.rwid === item);
        return selectedRow;
      });

      setAddedItems((prevAddedItems) => [...prevAddedItems, ...newAddedItems]);
      const saveCollectionList = addedItems.map((item) => {
        return {
          prdcd: item.prdcd,
        };
      });

      setSaveCollection(saveCollectionList);
      setSelectedItems([]);
    }
  };

  const handleClickOpen = () => {
    setModalProject(true);
  };
  
  useEffect(() => {
        fetchData();
    }, []);

    const [createAndUpdate, setCreateAndUpdate] = useState('');
    const [createCollenction, setCreateCollenction] = useState(false);

    const handleOnChange = (e) => {
        if (e.target.value == 'Create') {
            setCreateCollenction(true);
            setCreateCollenction('Create');
            setCreateAndUpdate(e.target.value);
        } else {
            setCreateCollenction(false);
            setCreateAndUpdate(e.target.value);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const encodedData = queryParams.get('data');
        if (encodedData == null) {
        } else {
            const decodedData = decodeURIComponent(encodedData);
            const parsedData = JSON.parse(decodedData);
            const prdcdArray = parsedData.catalogueprdimg.map((data) => data.prdcd);
            const filteredData = temptable.filter((item) => prdcdArray.includes(item.prdcd));
            setinputs(parsedData);
            setAddedItems(filteredData);
            setModalProject(true);
            setCreateCollenction(true);
            setCreateAndUpdate('Update');
           
            setBuyernameoption({lable:parsedData.buyercd,value:parsedData.buyercd})
            const saveCollectionList = filteredData.map((item) => {
                return {
                    rwid: item.rwid,
                    titlecd: item.titlecd, 
                    prdcd: item.prdcd,
                };
            });

            setTempupdate(saveCollectionList);
        }
    }, [location.search, temptable]);

    const fetchData = async () => {
        try {
            const [Product] = await Promise.all([fetch(`${url}/getAllProduct`, { headers: { Authorization: Token } })]);
            const Allproduct = await Product.json();
            const product = Allproduct.filter((item)=> item.dis != "YES");
            const categoryNames = Array.from(new Set(product.map((item) => ({ catnm: item.categorynm }))));
            const prdaliases = Array.from(new Set(product.map((item) => ({ alias: item.prdalias }))));
            const descriptions = Array.from(new Set(product.map((item) => ({ prdnm: item.prdnm }))));
            const colorall = product.map((item) => ({ color: item.prdColor }))
            const color = Array.from(new Set(colorall));

            const finish = Array.from(new Set(product.map((item) => ({ finish: item.prdfinish }))));

            setAllCategory(categoryNames);
            setPrdalias(prdaliases);
            setDiscription(descriptions);
            setAllColor(color); 
            setAllFinish(finish);
            setCataloguedata(product); 
            setTemptable(product);

        } catch (error) {
            console.log('Error:', error);
        }
    };

    // master search

    const [inputSearch, setInputSearch] = useState('');

    const HandleMasterkeyword = (e) => {
        setInputSearch(e.target.value);
    };

    const masterSearch = (e) => {
        e.preventDefault();
        if (inputSearch === '') {
            fetchData();
        } else {
            const filteredData = temptable.filter((item) => {
                return (
                    item.prdalias.toLowerCase().includes(inputSearch.toLowerCase()) ||
                    item.prdnm.toLowerCase().includes(inputSearch.toLowerCase())
                );
            });
            setCataloguedata(filteredData);
        }
    };

    // Filter products based on selected options

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectCategory, setSelectCategory] = useState([]);
    const [selectprdalias, setSelectprdalias] = useState([]);
    const [selectColor, setSelectColor] = useState([]);
    const [selectFinish, SetselectFinish] = useState([]);

    const handleAutocompleteChange = (stateSetter, filterKey, event, value) => {
        if (!value || value.length === 0) {
            fetchData();
        }
        stateSetter(value);
        const filteredData = temptable.filter((item) => value.some((option) => JSON.stringify(option).includes(item[filterKey])));
        setCataloguedata(filteredData);
    };

    const handleAutocompleteChangeprdnm = handleAutocompleteChange.bind(null, setSelectedOptions, 'prdnm');
    const handleAutocompleteChangecategory = handleAutocompleteChange.bind(null, setSelectCategory, 'categorynm');
    const handleAutocompleteChangeprdalias = handleAutocompleteChange.bind(null, setSelectprdalias, 'prdalias');
    const handleAutocompleteChangeColor = handleAutocompleteChange.bind(null, setSelectColor, 'prdColor');
    const handleAutocompleteChangeFinish = handleAutocompleteChange.bind(null, SetselectFinish, 'prdfinish');

    // save catalogue data into database

    const [inputs, setinputs] = useState({
        titlename: '',
        buyercd: '',
        remark: '',
    });

    const handlechange = (e) => {
        setinputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const convertedData = {
        titlename: inputs.titlename,
        buyercd: inputs.buyercd,
        remark: inputs.remark,
        createdby: "empName",
        updateby: "empName",
        catalogueprdimg: saveCollection,
    };

    const convertedData2 = {
        rwid: inputs.rwid,
        titlename: inputs.titlename,
        buyercd: inputs.buyercd,
        remark: inputs.remark,
        updateby: "empName",
        catalogueprdimg: saveCollection,
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const jsonData = JSON.stringify(convertedData);

        if (inputs.titlename === '') {
            alert('Enter Collection Name');
        } else if (inputs.buyercd === '') {
            alert('select Buyer Name');
        } else {
          console.log(JSON.stringify(convertedData));

            if (inputs.rwid == null) {
                fetch(`${url}/api/AddCatalogue`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: Token,
                    },
                    body: jsonData, 
                })
                    .then((response) => response.json())
                    .then((data) => {
                       
                    })
                    .catch((error) => {});
            } else {
                console.log(JSON.stringify(convertedData2));

                fetch(`${url}/api/UpdateCatalogue/${inputs.rwid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: Token,
                    },
                    body: JSON.stringify(convertedData2),
                })
                    .then((response) => response.json())
                    .then((data) => {
                       
                    })
                    .catch((error) => {});
            }
            setinputs({
                titlename: '',
                buyercd: '',
                remark: '',
            });
            setModalProject(false)
            setAddedItems([]);
        }
    };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Catalogue" pageTitle="Manage Catalogue" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <div class="col-xxl-2 col-sm-2 col-md-3">
                      <div>
                        <label for="iconrightInput" class="Collection">
                          Collection Name
                        </label>
                        <div class="form-icon right">
                          <Input
                            type="Text"
                            class="form-control form-control-icon"
                            id="Collection"
                            placeholder="Search..."
                          />
                          <i class="ri-search-line search-icon"></i>
                        </div>
                      </div>
                    </div>

                    <div class=" col-md-1"></div>

                    <div className="col-md-3">
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="Buyer-Name">
                          More Filters
                        </Label>
                        <Select
                          value={Filter}
                          isMulti={true}
                          isClearable={true}
                          onChange={(e) => {
                            handleMulti2(e);
                          }}
                          options={Filters}
                        />
                      </div>
                    </div>
                    <div class=" col-md-3 "></div>
                    <div className="col-md-2 mt-3">
                      <Button
                        style={{ backgroundColor: "white", border: "none" }}
                        onClick={handleAddToList}
                      >
                        <img
                          src={cartimage}
                          style={{
                            marginBottom: "20px",
                            height: "50px",
                            width: "50px",
                          }}
                          alt="View Cart"
                          onClick={
                            addedItems.length > 0 ? handleClickOpen : undefined
                          }
                        />
                      </Button>
                    </div>
                  </Row>

                  <Row>
                    {prdname && (
                      <>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="Product-Name"
                            >
                              Product Name
                            </Label>
                            <Select
                              value={prdnmoption}
                              isMulti={true}
                              isClearable={true}
                              onChange={(e) => {
                                setPrdnmoption(e)
                               
                              }}
                              options={AllDescription}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {ProductAlias && (
                      <>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="Product-Alias"
                            >
                              Product Alias
                            </Label>
                            <Select
                              value={prdaliasoption}
                              isMulti={true}
                              isClearable={true}
                              onChange={(e) => {
                                setPrdaliasoption(e)
                              }}
                              options={AllPRDAlias}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {category && (
                      <>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Category">
                              Category
                            </Label>
                            <Select
                              value={prdcatoption}
                              isMulti={true}
                              isClearable={true}
                              onChange={(e) => {
                                setPrdcatoption(e)
                              }}
                              options={AllCategories}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {color && (
                      <>
                        {" "}
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Color">
                              Color
                            </Label>
                            <Select
                              value={prdcoloroption}
                              isMulti={true}
                              isClearable={true}
                              onChange={(e) => {
                                setPrdcoloroption(e)
                              }}
                              options={AllColor}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {finish && (
                      <>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Finish">
                              Finish
                            </Label>
                            <Select
                              value={prdfinishoption}
                              isMulti={true}
                              isClearable={true}
                              onChange={(e) => {
                                setPrdfinishoption(e)
                              }}
                              options={AllFinish}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </Row>
                  <hr></hr>
                  <Row>
                    {cataloguedata.map((row) => (
                      <>
                        <div class="col-xl-3 col-lg-4 col-sm-6">
                          <div class="gallery-box card">
                            <div class="gallery-container">
                              <img
                                class="gallery-img img-fluid mx-auto"
                                src={`${url}/image/ProductImage/${row.rwid}`}
                                alt=""
                              />
                            </div>
                          </div>

                          <div
                            className="content"
                            style={{
                              whiteSpace: "nowrap",
                              display: "flex",
                              justifyContent: "space-around",
                              paddingLeft: "0px",
                            }}
                          >
                            <div className="mt-1">
                              <h6> SKU# {row.prdalias}</h6>
                            </div>
                            <div>
                              <Button
                                className=""
                                style={{
                                  backgroundColor: addedItems.some(
                                    (item) => item.rwid === row.rwid
                                  )
                                    ? "red"
                                    : "Green",
                                  color: "white",
                                  borderRadius: 5,
                                  fontSize: "10px",
                                  padding: "4px 8px",
                                }}
                                onClick={() => handleButtonClick(row.rwid)}
                              >
                                {addedItems.some(
                                  (item) => item.rwid === row.rwid
                                )
                                  ? "Remove"
                                  : "ADD TO CART"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </Row>
                  <ToastContainer closeButton={false} limit={10} />
                </CardHeader>
              </Card>
            </Col>
          </Row>
        </Container>

        <Modal
          size="lg"
          backdrop={"static"}
          isOpen={modalProject}
          toggle={() => setModalProject(!modalProject)}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader
            toggle={() => setModalProject(!modalProject)}
            className="p-3 bg-success-subtle"
          >
          View Cart Product
          </ModalHeader>
          <ModalBody>
            <Row>
              <div className="col-md-3">
                <div className="mb-3">
                  <Label className="form-label" htmlFor="Type">
                    Type
                  </Label>
                  <Select
                    value={actino}
                    onChange={(e) => {
                      setAction(e);
                    
                    }}
                    options={Action}
                    id="Type"
                    className="js-example-basic-single mb-0"
                    name="Type"
                  /> 
                </div>
              </div>

              <div className="col-md-3 col-sm-4">
                <div className="mb-3">
                  <Label className="form-label" htmlFor="Collection-Name">
                    Collection Name
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="Collection-Name"
                    placeholder="Enter Collection Name"
                    name="titlename"
                    value={inputs.titlename}
                    onChange={handlechange}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="mb-3">
                  <Label className="form-label" htmlFor="Buyer">
                    Buyer Name
                  </Label>
                  <Select 
                    value={buyernameoption}
                    onChange={(e) => {
                      setBuyernameoption(e);
                      setinputs({...inputs,buyercd:e.value})
                    }}
                    options={Buyername}
                    id="Buyer"
                    className="js-example-basic-single mb-0"
                    name="Buyer"
                  />
                </div>
              </div>

              <div className="col-md-3 col-sm-4">
                <div className="mb-3">
                  <Label className="form-label" htmlFor="Remark">
                    Remark
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="Remark"
                    placeholder="Enter Remark Name"
                    name="remark"
                    value={inputs.remark}
                    onChange={handlechange}

                  />
                </div>
              </div>
            </Row>

            <Row>
              {addedItems.map((row) => (
                <>
                  <div class="col-xl-3 col-lg-4 col-sm-6">
                    <div class="gallery-box card">
                      <div class="gallery-container">
                        <img
                          class="gallery-img img-fluid mx-auto"
                          src={`${url}/image/ProductImage/${row.rwid}`}
                          alt=""
                        />
                      </div>
                    </div>

                    <div
                      className="content"
                      style={{
                        whiteSpace: "nowrap",
                        display: "flex",
                        justifyContent: "space-around",
                        paddingLeft: "0px",
                      }}
                    >
                      <div className="mt-1">
                        <h6> SKU# prdAlias123</h6>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <Button
                color="light"
                onClick={() => {
                  setModalProject(false);
                }}
              >
                Close
              </Button>
              <Button type="submit" color="success" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};
export default Catalogue;
 