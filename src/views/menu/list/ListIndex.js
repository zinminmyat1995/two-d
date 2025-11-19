import React, { useState, useEffect,useRef  } from "react";
import {
    CAvatar,
    CButton,
    CFormSelect,
    CCol,
    CRow,
    CFormInput
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Confirmation from "../../common/Confirmation";
import {validateIntegerOnly} from "../../common/CommonValidation"
import Message from "../../common/SuccessError";
import { Image as ImageIcon } from "lucide-react";
import Loading from "../../common/Loading"
import ApiPath from "../../common/ApiPath";
import { ApiRequest } from "../../common/ApiRequest";
import deleteImg from '../../../assets/images/delete.png';
import updateImg from '../../../assets/images/update.png';
import editImg from '../../../assets/images/edit.png';
import noDataImg from '../../../assets/images/no-data.png';
import Key from '../../common/CommonKey'

const ListIndex = () => {
    const url = Key.IMAGE_URL;
    const [error, setError] = useState([]); // for error message
    const [success, setSuccess] = useState([]); // for success message
    const [name, setName] = useState("");
    const [itemData, setItemData ] = useState([]);
    const [item, setItem ] = useState("");
    const [copyData, setCopyData] = useState([]);
    const [userData, setUserData] = useState([])
    const [meatData, setMeatData ] = useState([]);
    const [deletedID, setDeletedID ] = useState("");
    const [updatedID, setUpdatedID ] = useState("");
    const [show, setShow] = useState(false); // 
    const [content, setContent] = useState(""); // 
    const [type, setType] = useState("save"); //
    const [loading, setLoading] = useState(false);  // for loading
    const [loginID , setLoginID ] = useState(localStorage.getItem('LOGIN_ID'));
    const [imageFile, setImageFile] = useState(null);
    const [currentItem, setCurrentItem] = useState(null);
    

    useEffect(() => {
        (async () => {
            if(localStorage.getItem("LOGIN_ID") == undefined){
                window.location.href="/login";
            }
            setLoading(true);
            await getMenuType();
            await getMeatType();
            await searchClick();
        })();
    }, []);

    let getMeatType =async ()=>{
        setLoading(true);
        let object = {
            url: ApiPath.MeatTypeSearch,
            method: 'get',
            params: {
                "login_id": loginID
            }
        }
    
        let response = await ApiRequest(object);
        if (response.flag === false) {
                setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setMeatData(response.data.data);
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }

    let getMenuType =async ()=>{
        let object = {
            url: ApiPath.MenuTypeSearch,
            method: 'get',
            params: {
                "login_id": loginID
            }
        }
    
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setItemData(response.data.data);
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }
    

    let searchClick =async () => {
        setError([]); setSuccess([]);
        setLoading(true);
        let object = {
            url: ApiPath.MenuSearch,
            method: 'get',
            params: {
                "name": name,
                "type": item,
                "login_id": loginID
            }
        }

        let response = await ApiRequest(object);
        if (response.flag === false) {
            setUserData([]); setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setUserData(response.data.data);setCopyData(response.data.data);setLoading(false);
                // setDeletedData([]);setDeletedID("");
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }

    let tempSearchClick =async () => {
        setLoading(true);
        let object = {
            url: ApiPath.MenuSearch,
            method: 'get',
            params: {
                "name": name,
                "type": item,
                "login_id": loginID
            }
        }

        let response = await ApiRequest(object);
        if (response.flag === false) {
            setUserData([]); setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setUserData(response.data.data);setCopyData(response.data.data);setLoading(false);
                setDeletedID("");setUpdatedID("");
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }

    let updateClick =async (id) => {
        let temp = userData.filter(data=> data.id == id)
        if(temp[0]['price'] == ""){
            setError(["Please fill price!"]);
            setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }else{
            setError([]); setSuccess([]);setLoading(false);setType("save");
            setUpdatedID(id);
            setShow(true);setContent("Are you sure want to update?");
        }
    }

    let deleteClick = (id) => {
        setError([]); setSuccess([]);setLoading(false);setType("delete");setDeletedID(id);
        setShow(true);setContent("Are you sure want to delete?");
    }

    
    let editClick = (id) => {
        let temp = copyData.map(data => ({
            ...data,
            edit_flag: data.id === id
        }));
        setUserData(temp);
    };

    let editPriceChange = (id, val)=>{
        let res = userData.filter(data => {
            if (data.id == id) {
                if(val == ""){
                    data.price = "";
                }else{
                    if(validateIntegerOnly(val) == true && val.charAt(0) != 0 ){
                        data.price = val;
                    }
                }
                return data;
            }
            return data;
        })
        setUserData(res);
    }

    let editMeatChange = (id, val)=>{
        let res = userData.filter(data => {
            if (data.id == id) {
                data.meat_type = val;
                return data;
            }
            return data;
        })
        setUserData(res);
    }


    let saveOK =async ()=>{
        let res = userData.filter(data => data.id == updatedID)
        console.log("res",res)
        setError([]);setSuccess([]);setLoading(true);setShow(false);
        let object = {
            url: ApiPath.MenuUpdate,
            method: 'post',
            params: {
                "id": res[0]['id'],
                "price": res[0]['price'],
                "meat_id": res[0]['meat_type'],
                "menu_name": res[0]['menu_name'],
                "login_id": loginID
            }
        }
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);tempSearchClick();
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setError([response.data.message]);setSuccess([]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } 
        }
    }

    let deleteOK =async ()=>{
        setSuccess([]); setError([]); setShow(false);
        setLoading(true);
        let object = {
            url: ApiPath.MenuDelete,
            method: 'delete',
            params: {
                "login_id": loginID,
                "menu_id": deletedID
            }
        }

        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setUserData([]); setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setSuccess([response.data.message]);setError([]);
                tempSearchClick();window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }
    
    let itemChange = (e) => {
        setItem(e.target.value);
    }


    let editNameChange = (id, val)=>{
        let res = userData.filter(data => {
            if (data.id == id) {
                data.menu_name = val;
                return data;
            }
            return data;
        })
        setUserData(res);
    }

    const fileRef = useRef(null);

    const handleThumbClick = (item) => {
        setCurrentItem(item);
        fileRef.current.value = "";     
        fileRef.current.click();        // 👉 file chooser open
    };

 
    console.log(imageFile);

    const handleImageChange = async (e) => {
		const file = e.target.files[0];

		if (!file){
			setImageFile(null);
			return;
		}

		try {
			const result = await validateImage(file);
			uploadFun(file);
			
		} catch (err) {
			alert(err);
			e.target.value = ""; // reset file input
		}
	};


    let uploadFun =async (file)=>{
        setError([]);setSuccess([]);setLoading(true);setShow(false);
        const formData = new FormData();
        formData.append("id", currentItem['id']);
        formData.append("login_id", loginID);
    
        if (file) {
            formData.append("image", file);
        }

            let obj = {
                method: "post",
                url: ApiPath.MenuImageUpload,
                data: formData, 
            };
        let response = await ApiRequest(obj);
        if (response.flag === false) {
            setError([response.message[0]]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);tempSearchClick();
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setError([response.data.message]);setSuccess([]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } 
        }
    }

    
    const validateImage = (file) => {
        return new Promise((resolve, reject) => {
            const maxSize = 1 * 1024 * 1024; // 1MB

            if (file.size > maxSize) {
            reject("Image size must be less than 1MB!");
            return;
            }

            // ❗ use window.Image instead of Image
            const img = new window.Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
            const width = img.width;
            const height = img.height;

            if (width < 300 || height < 300) {
                reject("Image resolution must be at least 300x300!");
                return;
            }

            if (width > 2000 || height > 2000) {
                reject("Image resolution too large! Try smaller resolution.");
                return;
            }

            resolve("OK");
            };

            img.onerror = () => reject("Invalid image file!");
        });
        };

    return (
        <>
            <Loading start={loading} />
            <h3>Menu List</h3>
            <hr />
            <Confirmation
                show={show}
                content={content}
                type={type}
                saveOK={saveOK}
                deleteOK={deleteOK}
                okButton={"Ok"}
                cancel={() => setShow(false)}
                cancelButton={"Cancel"}
            />
            <Message success={success} error={error} />
            <CRow className="mt-5">
                <CCol lg="2" className="text-align-center">
                    <p className="label">Menu Name</p>
                </CCol>
                <CCol lg="3">
                    <CFormInput type="text" aria-label="sm input example"  value={name} onChange={(e) => setName(e.target.value)} />
                </CCol>
                <CCol lg="1"></CCol>
                <CCol lg="2" className="text-align-center">
                    <p className="label" >Menu Type</p>
                </CCol>
                <CCol lg="3">
                    <CFormSelect className="mb-3"   onChange={(e) => itemChange(e)}>
                        <option value=""></option>
                        {itemData.length > 0 &&
                            itemData.map((data, ind) => {
                                return (
                                    <option value={data.id} key={ind}>{data.name}</option>
                                )
                            })
                        }
                    </CFormSelect>
                </CCol>
            </CRow>

            <CRow className="mt-5 mb-5 text-align-center">
                <CCol>
                    <CButton className="login-button" style={{ width: "100px" }} onClick={() => searchClick()}>Search</CButton>
                </CCol>
            </CRow>

          
            <input
                type="file"
                ref={fileRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
            />

            {userData.length > 0 ?(
                <>
                    <CRow>
                        <CCol>
                            <label className="total-row">Total - {userData.length}  row(s)</label>
                        </CCol>
                    </CRow>
                    <CRow className="mb-4">
                        <CCol>
                            <div className='table-responsive tableFixHead'>
                                <table className='table menu-list-table'>
                                    <thead className="text-center">
                                        <tr>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="60px" >No</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="100px" >Image</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="230px">Menu Category</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="260px">Menu Name</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="200px">Meat</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="180px">Price</th>
                                            <th className="bg-body-tertiary text-center" colSpan={2} style={{verticalAlign: "middle"}} width="100px">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                    {userData.map((item, index) => (
                                        <tr
                                            key={index}
                                            style={{ transition: "0.3s" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fff4")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="cv-thumb" onClick={() => handleThumbClick(item)}>
                                                    {item.image_path == null ? (
                                                    <div className="cv-thumb-placeholder">
                                                        <ImageIcon />
                                                    </div>
                                                    ) : (
                                                    <img
                                                        className="cv-thumb-img"
                                                        src={`${url}/${item.image_path}`}
                                                        alt={item.menu_name}
                                                    />
                                                    )}
                                                    
                                                </div>
                                            </td>

                                            <td>{item.menu_type_name}</td>
                                            <td>
                                                {item.edit_flag == true ?
                                                    <CFormInput type="text" aria-label="sm input example" value={item.menu_name} onChange={(e) => editNameChange(item.id, e.target.value)} />
                                                    :
                                                    <label>{item.menu_name}</label>
                                                }
                                            </td>
                                            <td>

                                                {item.edit_flag == true ?
                                                    item.meat_type_name == null ? ""
                                                    :
                                                     <CFormSelect className="mb-3" value={item.meat_type}   onChange={(e) => editMeatChange(item.id, e.target.value)}>
                                                        {meatData.length > 0 &&
                                                            meatData.map((data, ind) => {
                                                                return (
                                                                    <option value={data.id} key={ind}>{data.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </CFormSelect>
                                                    :
                                                    <label>{item.meat_type_name}</label>
                                                }

                                            </td>
                                            <td className="fw-bold">
                                                {item.edit_flag == true ?
                                                    <CFormInput type="text" aria-label="sm input example" value={item.price} onChange={(e) => editPriceChange(item.id, e.target.value)} /> :
                                                    <label>฿{item.price}</label>
                                                }
                                            </td>
                                            <td>
                                                {item.edit_flag === true ? (
                                                    <img src={updateImg} alt="Girl Headphones" width={"30"} 
                                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                        onClick={() => updateClick(item.id)}
                                                    />
                                                
                                                ) : (

                                                    <img src={editImg} alt="Girl Headphones" width={"30"} 
                                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                        onClick={() => editClick(item.id)}
                                                    />
                                                
                                                )}
                                            </td>
                                            <td>
                                                <img src={deleteImg} alt="Girl Headphones" width={"30"} 
                                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                    onClick={() => deleteClick(item.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>
                        </CCol>
                    </CRow>
                </>
            ) : (
                            // ❌ Data not found UI
                            <div
                                style={{
                                textAlign: "center",
                                padding: "60px 20px",
                                color: "#6c757d",
                                border: "2px dashed #dee2e6",
                                borderRadius: "12px",
                                backgroundColor: "#f8f9fa",
                                boxShadow: "inset 0 0 10px rgba(0,0,0,0.03)",
                                }}
                            >
                                <img
                                    src={noDataImg}
                                    alt="No Data"
                                    width="90"
                                    className="mb-3"
                                    style={{ opacity: 0.8 }}
                                />
                                <h5 style={{ fontWeight: "600" }}>No Data Found</h5>
                                <p style={{ fontSize: "14px", color: "#999" }}>
                                    There are currently no records to display.
                                </p>
                            </div>
                )}

                <style>{`
                     /* Each row: [IMAGE] [TEXT] [PRICE] */
                        .cv-item{
                        display:grid;
                        grid-template-columns: 64px 1fr auto;
                        gap:12px;
                        align-items:center;
                        background:#fff;
                        border-radius:14px;
                        border:1px solid #f1eef2;
                        box-shadow:0 1px 2px rgba(0,0,0,.03);
                        padding:10px;
                        }

                        /* LEFT: thumbnail */
                        .cv-thumb{
                        width:54px;
                        height:54px;
                        border-radius:12px;
                        overflow:hidden;
                        background:#f5f5f5;
                        position:relative;
                        flex-shrink:0;
                        margin: auto;
                        }
                        .cv-thumb-img{
                        width:100%;
                        height:100%;
                        object-fit:cover;
                        object-position:center;
                        display:block;
                        }
                         /* Placeholder center */
                        .cv-thumb-placeholder{
                        position:absolute;
                        inset:0;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        opacity:0.6;
                        }
                        .cv-thumb-placeholder svg{
                        width:26px;
                        height:26px;
                        color:#9ca3af;
                        }
                `}</style>

        </>
    )
}

export default ListIndex
