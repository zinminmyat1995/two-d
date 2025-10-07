import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormTextarea,
  CFormSelect,
  CFormSwitch
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import Message from "../../common/SuccessError";
import Confirmation from "../../common/Confirmation";
import Loading from "../../common/Loading"
import { cilMinus, cilPlus } from '@coreui/icons'
import PlusPaymentModal from "./PlusPaymentModal"
import MinusPaymentModal from "./MinusPaymentModal";
import PlusTableModal from "./PlusTableModal"
import MinusTableModal from "./MinusTableModal";
import {validateIntegerOnly} from "../../common/CommonValidation"
import ApiPath from "../../common/ApiPath";
import { ApiRequest } from "../../common/ApiRequest";

const SettingIndex = () => {
	const [error, setError] = useState([]); // for error message
	const [success, setSuccess] = useState([]); // for success message
	const [errorPlus, setErrorPlus] = useState([]); // for error message
	const [successPlus, setSuccessPlus] = useState([]); // for success message
	const [errorMinus, setErrorMinus] = useState([]); // for error message
	const [successMinus, setSuccessMinus] = useState([]); // for success message
	const [loading, setLoading] = useState(false);  // for loading
	const [ paymentData, setPaymentData ] = useState([]);
	const [addPayment, setAddPayment ] = useState("");
	const [deletedPaymentID, setDeletedPaymentID ] = useState("");

	const [ tableData, setTableData ] = useState([]);			
	const [addTableName, setAddTableName ] = useState("");
	const [deletedTableID, setDeletedTableID ] = useState("");
	const [show, setShow] = useState(false); // 
	const [content, setContent] = useState(""); // 
	const [type, setType] = useState("save"); //
	const [status, setStatus ] = useState("");
	const [plusModalShow, setPlusModalShow ] = useState(false);
	const [plusModalShow1, setPlusModalShow1 ] = useState(false);
	
	const [minusModalShow, setMinusModalShow ] = useState(false);
	const [minusModalShow1, setMinusModalShow1 ] = useState(false);




	const [discount, setDiscount] = useState(false);
	const [discountPercent, setDiscountPercent ] = useState("");
	
	
	
	const [deilveryService, setDeilveryService] = useState(false);
	const [printService, setPrintService] = useState(false);
	const [loginID , setLoginID ] = useState(localStorage.getItem('LOGIN_ID'));

	useEffect(() => {
		(async () => {
			if(localStorage.getItem("LOGIN_ID") == undefined){
				window.location.href="/login";
			}
			// setLoading(true);
			await getPayment();
			await getTable();


			// await getDiscount();
			
			// await getDelivery();
			// await getPrint();
		})();
	}, []);


	let getPayment =async () => {
		let object = {
			url: ApiPath.SettingPaymentSearch,
			method: 'get',
			params: {
				"login_id": loginID
			}
		}
	
		let response = await ApiRequest(object);
		if (response.flag === false) {
			setError([]); setSuccess([]); setLoading(false);
		} else {
			if (response.data.status === 'OK') {
				setLoading(false);
				setPaymentData(response.data.data);
			} else {
				setError([response.data.message]); setSuccess([]);
				window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
			}
		}
		
	}

	let getTable =async () => {
		let object = {
			url: ApiPath.SettingTableSearch,
			method: 'get',
			params: {
				"login_id": loginID
			}
		}
	
		let response = await ApiRequest(object);
		if (response.flag === false) {
			setError([]); setSuccess([]); setLoading(false);
		} else {
			if (response.data.status === 'OK') {
				setLoading(false);
				setTableData(response.data.data);
			} else {
				setError([response.data.message]); setSuccess([]);
				window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
			}
		}
		
	}

	let saveOK =async ()=>{
		setError([]);setSuccess([]);setShow(false);setLoading(true);
		let obj = ""; let response = "";
		if(status == "payment-add"){
			obj = {
				method: "post",
				url: ApiPath.SettingPaymentSave,
				params: {
					"login_id": loginID,
					"payment_name": addPayment
				},
			  };
			response = await ApiRequest(obj);
		}else if(status == "table-add"){
			obj = {
				method: "post",
				url: ApiPath.SettingTableSave,
				params: {
					"login_id": loginID,
					"table_name": addTableName
				},
			};
			response = await ApiRequest(obj);
		}

		  if (response.flag === false) {
			setSuccess([]);setLoading(false);
			if(status == "payment-add" || status == "table-add"){
				setErrorPlus([response.data.data.message]);
			}else{
				setError([response.data.data.message]);
				window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
			}
		  } else {
			if (response.data.status == "OK") {
				if(status == "payment-add" || status == "table-add"){
					setSuccessPlus([response.data.message]);getPayment();getTable();
				}else{
					setSuccess([response.data.message]);
					window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
				}
			  setError([]);clear();setStatus("");
			}else{
				if(status == "payment-add" || status == "table-add"){
					setErrorPlus([response.data.message]);
				}else{
					setError([response.data.message]);
					window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);setStatus("");
				}
				setSuccess([]);setLoading(false);
			} 
		  }
		
	}

	let deleteOK =async ()=>{
		setError([]);setSuccess([]);setShow(false);setLoading(true);
		let obj = ""; let response = "";
		if(status == "payment-delete"){
			obj = {
				method: "delete",
				url: ApiPath.SettingPaymentDelete,
				params: {
					"login_id": loginID,
					"payment_name": deletedPaymentID
				},
			  };
			response = await ApiRequest(obj);
		}else if(status == "table-delete"){
			obj = {
				method: "delete",
				url: ApiPath.SettingTableDelete,
				params: {
					"login_id": loginID,
					"table_name": deletedTableID
				},
			  };
			response = await ApiRequest(obj);
		}

		  if (response.flag === false) {
			setSuccess([]);setLoading(false);
			if(status == "payment-delete" || status == "table-delete"){
				setErrorMinus([response.data.data.message]);
			}else{
				setError([response.data.data.message]);
				window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);setStatus("");
			}
		  } else {
			if (response.data.status == "OK") {
				if(status == "payment-delete" || status == "table-delete"){
					setSuccessMinus([response.data.message]);getPayment();getTable();
				}else{
					setSuccess([response.data.message]);
					window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);setStatus("");
				}
			  setError([]);clear();
			}else{
				 if(status == "payment-delete" || status == "table-delete"){
					setErrorMinus([response.data.message]);
				}else{
					setError([response.data.message]);
					window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);setStatus("");
				}
				setSuccess([]);setLoading(false);
			} 
		  }
	}

	let clear = ()=>{
		setAddPayment("");setDeletedPaymentID("");setAddTableName("");
	}

	let cancelClick = ()=>{
		setShow(false);
		setError([]);setSuccess([]);	
		if(status == "payment-add"){
			setPlusModalShow(true);
		}else if(status == "payment-delete"){
			setMinusModalShow(true);
		}else if(status == "table-add"){
			setPlusModalShow1(true);
		}else if(status == "table-delete"){
			setMinusModalShow1(true);
		}
	}

	let cancelClick1 = ()=>{
		setPlusModalShow(false);setPlusModalShow1(false);
		setErrorPlus([]);setSuccessPlus([]);
	}

	let saveOKPlusModel = ()=>{
		if(addPayment == ""){
			setErrorPlus(["Please fill payment name!"]); setSuccessPlus([]);
		}else{
			setErrorPlus([]); setSuccessPlus([]);
			setStatus("payment-add");setType("save");
			setShow(true);setPlusModalShow(false);setContent("Are you sure want to save for payment setting?");
		}
	}

	let saveOKPlusModel1 = ()=>{
		if(addTableName == ""){
			setErrorPlus(["Please fill table name!"]); setSuccessPlus([]);
		}else{
			setErrorPlus([]); setSuccessPlus([]);
			setStatus("table-add");setType("save");
			setShow(true);setPlusModalShow1(false);setContent("Are you sure want to save for table setting?");
		}
	}

	let addPaymentChange = (e)=>{
		setAddPayment(e.target.value);
	}

	let addTableNameChange = (e)=>{
		setAddTableName(e.target.value);
	}
	

	let removePaymentChange =(e)=>{
		setDeletedPaymentID(e.target.value)
	}

	let removeTableChange =(e)=>{
		setDeletedTableID(e.target.value)
	}

	
	let saveOKMinusModel = ()=>{
		if(deletedPaymentID == ""){
			setErrorMinus(["Please select payment name!"]); setSuccessMinus([]);
		}else{
			setErrorMinus([]); setSuccessMinus([]);
			setMinusModalShow(false);setType("delete");
			setStatus("payment-delete");
			setShow(true);setContent("Are you sure want to delete for payment setting?");
		}
	}

	let saveOKMinusModel1 = ()=>{
		if(deletedTableID == ""){
			setErrorMinus(["Please select table name!"]); setSuccessMinus([]);
		}else{
			setErrorMinus([]); setSuccessMinus([]);
			setMinusModalShow1(false);setType("delete");
			setStatus("table-delete");
			setShow(true);setContent("Are you sure want to delete for table setting?");
		}
	}


	

	let cancelClick2 = ()=>{
		setMinusModalShow(false);setErrorMinus([]);setSuccessMinus([]);setMinusModalShow1(false);
	}

  return (
	<CRow>
		<CCol>
			<CForm>
				<Loading start={loading} />
				<h3>Setting</h3>
				<hr/>
				<Message success={success} error={error} />
				<Confirmation
					show={show}
					content={content}
					type={type}
					saveOK={saveOK}
					deleteOK={deleteOK}
					okButton={"Ok"}
					cancel={cancelClick}
					cancelButton={"Cancel"}
				/>
				<PlusPaymentModal
					success={successPlus}
					error={errorPlus}
					show={plusModalShow}
					saveOK={saveOKPlusModel}
					okButton={"Ok"}
					cancel={cancelClick1}
					cancelButton={"Cancel"}
					addPayment ={addPayment}
					addPaymentChange={addPaymentChange}
				/>
				<MinusPaymentModal
					success={successMinus}
					error={errorMinus}
					show={minusModalShow}
					saveOK={saveOKMinusModel}
					okButton={"Ok"}
					cancel={cancelClick2}
					cancelButton={"Cancel"}
					paymentData={paymentData}
					deletedPaymentID={deletedPaymentID}
					removePaymentChange={removePaymentChange}
				/>

				<PlusTableModal
					success={successPlus}
					error={errorPlus}
					show={plusModalShow1}
					saveOK={saveOKPlusModel1}
					okButton={"Ok"}
					cancel={cancelClick1}
					cancelButton={"Cancel"}
					addPayment ={addTableName}
					addPaymentChange={addTableNameChange}
				/>

				<MinusTableModal
					success={successMinus}
					error={errorMinus}
					show={minusModalShow1}
					saveOK={saveOKMinusModel1}
					okButton={"Ok"}
					cancel={cancelClick2}
					cancelButton={"Cancel"}
					paymentData={tableData}
					deletedPaymentID={deletedTableID}
					removePaymentChange={removeTableChange}
				/>

				
				<CRow className="mt-5 setting-fieldset">
					<CCol lg="2" className="text-align-center">
						<CButton className="setting-fieldset-hearder">Payment Setting</CButton>
					</CCol>
					<CRow className="mt-5 mb-5">
						<CCol lg="1"></CCol>
							<CCol lg="2" className="text-align-center">
									<p className="label">Payment Name</p>
							</CCol>
							<CCol lg="3">
								<div style={{display: "flex"}}>
								<CFormSelect className="mb-3"  style={{width: "75%"}}>
										{paymentData.length> 0 &&
												paymentData.map((data,ind)=>{
												return(
													<option value={data.id} key={ind}>{data.name}</option>
												)
											})
										}
								</CFormSelect>
								<CIcon icon={cilPlus} className="plus-button" style={{marginLeft: "10px", marginRight: "10px"}} onClick={()=>setPlusModalShow(true)}  /> 
								<CIcon icon={cilMinus} className="plus-button" onClick={()=>setMinusModalShow(true)}   />
								</div>
						</CCol>
					</CRow>
				</CRow>


				<CRow className="mt-5 setting-fieldset mb-5">
					<CCol lg="2" className="text-align-center">
						<CButton className="setting-fieldset-hearder">Table Setting</CButton>
					</CCol>
					<CRow className="mt-5 mb-5">
						<CCol lg="1"></CCol>
							<CCol lg="2" className="text-align-center">
									<p className="label">Table Name</p>
							</CCol>
							<CCol lg="3">
								<div style={{display: "flex"}}>
								<CFormSelect className="mb-3"  style={{width: "75%"}}>
										{tableData.length> 0 &&
												tableData.map((data,ind)=>{
												return(
													<option value={data.id} key={ind}>{data.name}</option>
												)
											})
										}
								</CFormSelect>
								<CIcon icon={cilPlus} className="plus-button" style={{marginLeft: "10px", marginRight: "10px"}} onClick={()=>setPlusModalShow1(true)}  /> 
								<CIcon icon={cilMinus} className="plus-button" onClick={()=>setMinusModalShow1(true)}   />
								</div>
						</CCol>
					</CRow>
				</CRow>







		
			  </CForm>
		</CCol>
	</CRow>
	
  )
}

export default SettingIndex
