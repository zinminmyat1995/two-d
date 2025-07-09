import React,{useState,useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import ApiPath from "../../common/ApiPath";
import { ApiRequest } from "../../common/ApiRequest";
import Loading from "../../common/Loading"
import Message from "../../common/SuccessError";

const Login = () => {
  const [liveData, setLiveData] = useState(null);
  const [result, setResult] = useState([]);
  const [live, setLive ] = useState(null);
  const [ set1, setSet1 ] = useState(null);
  const [ set2, setSet2 ] = useState(null);
  const [ value1, setValue1 ] = useState(null);
  const [ value2, setValue2 ] = useState(null);
  const [ no1, setNo1 ] = useState(null);
  const [ no2, setNo2 ] = useState(null);


  useEffect(() => {
    liveApi();

    const interval = setInterval(() => {
      liveApi(); // Auto refresh every 30 sec
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  

   const liveApi = async () => {
      // Get current time
      const now = new Date();
      const currentHour = now.getHours(); // 0-23 format
      
    try {
      const response = await fetch("https://api.thaistock2d.com/live");
      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      setLiveData(data); // keep the whole object too
      setResult(data.result)
    
      setLive(data.live.twod)
      if (currentHour < 13) {
        // Before 1 PM
        setSet1(data.live.set);
        setValue1(data.live.value);
        setNo1(data.live.twod);
      } else {
        // 1 PM or later
        setSet2(data.live.set);
        setValue2(data.live.value);
        setNo2(data.live.twod);
      }

    } catch (err) {
      console.error("Failed to fetch live data:", err);
    }
  };

  console.log(liveData)
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light px-3">
      <div className="w-100" style={{ maxWidth: "400px", position: "fixed", top: "0" }}>
        <div className="bg-primary text-white text-center  py-2 header-color">
          <h5 className="mb-0 header-text">Thai Stock 2D</h5>
        </div>

        <div className="bg-white text-center p-3 shadow rounded-bottom">
           <AnimatePresence mode="wait">
            <motion.h1
              key={Date.now()} // <- Key is important for re-render animation
              className="display-1 fw-bold text-shadow"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {live}
            </motion.h1>
          </AnimatePresence>

          <p className="text-muted update-time">
            <i className="bi bi-clock"></i> {liveData != null ? liveData['server_time'] : ""}
          </p>

          <div className="mt-4">
            {/* 11:00 AM Section */}
            <div className="bg-info text-white rounded p-3 mb-3 first-card">
              <label className='time'>12:00 AM</label>
              <hr/>
              <CRow>
                <CCol style={{fontWeight: "100", fontSize: "15px", fontStyle: "italic"}}>Set</CCol>
                <CCol style={{fontWeight: "100", fontSize: "15px", fontStyle: "italic"}}>Value</CCol>
                <CCol style={{fontWeight: "100", fontSize: "15px", fontStyle: "italic"}}>2D</CCol>
              </CRow>
              <CRow>
                <CCol style={{fontWeight: "bold", fontSize: "17px"}}>{result.length>0? (result[1]['set'] == "--" ?set1 : result[1]['set']): "--"}</CCol>
                <CCol style={{fontWeight: "bold", fontSize: "17px"}}>{result.length>0? (result[1]['value'] == "--" ?value1 : result[1]['value']): "--"}</CCol>
                <CCol style={{fontWeight: "bold", fontSize: "17px"}}>{result.length>0? result[1]['twod']: "--"}</CCol>
              </CRow>
            </div>

            {/* 12:01 PM Section */}
            <div className="bg-primary text-white rounded p-3 second-card">
              <label className='time'>04:30 PM</label>
               <hr/>
              <CRow>
                  <CCol style={{fontWeight: "100", fontSize: "15px", fontStyle: "italic"}}>Set</CCol>
                  <CCol style={{fontWeight: "100", fontSize: "15px", fontStyle: "italic"}}>Value</CCol>
                  <CCol style={{fontWeight: "100", fontSize: "15px", fontStyle: "italic"}}>2D</CCol>
                </CRow>
                <CRow>
                  <CCol style={{fontWeight: "bold", fontSize: "17px"}}>{result.length>0? (result[3]['set'] == "--" ?result[3]['set'] : set2): "--"}</CCol>
                  <CCol style={{fontWeight: "bold", fontSize: "17px"}}>{result.length>0? (result[3]['value'] == "--" ?result[3]['value'] : value2 ): "--"}</CCol>
                  <CCol style={{fontWeight: "bold", fontSize: "17px"}}>{result.length>0? result[3]['twod']: "--"}</CCol>
                </CRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
