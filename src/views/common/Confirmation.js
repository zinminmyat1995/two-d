import React from 'react';
import {
  CRow,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilWarning, cilCheckCircle, cilTrash, cilSync } from '@coreui/icons';

const Confirmation = (props) => {
  // 🌈 Color + Icon logic based on type
  const getModalStyle = () => {
    switch (props.type) {
      case 'delete':
      case 'remove':
        return { color: '#dc3545', icon: cilTrash };
      case 'update':
        return { color: '#0d6efd', icon: cilSync };
      case 'save':
      case 'confirm':
        return { color: '#198754', icon: cilCheckCircle };
      case 'active':
        return { color: '#198754', icon: cilCheckCircle }; // ✅ Active = green + check
      case 'inactive':
        return { color: '#6c757d', icon: cilWarning };    // ✅ Inactive = grey + warning
      default:
        return { color: '#6c757d', icon: cilWarning };
    }
  };

  const { color, icon } = getModalStyle();

  return (
    <CModal
      alignment="center"
      visible={props.show}
      onClose={props.cancel}
      aria-labelledby="VerticallyCenteredExample"
      className="confirmation-modal"
    >
      <CModalHeader
      
        className="d-flex align-items-center justify-content-center border-0"
        style={{
          background: `linear-gradient(135deg, ${color}33, ${color}11)`,
          borderBottom: 'none',
        }}
      >
        <div
          style={{
            backgroundColor: color,
            borderRadius: '50%',
            width: '55px',
            height: '55px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 10px ${color}55`,
          }}
        >
          <CIcon icon={icon} size="xl" style={{ color: 'white' }} />
        </div>
      </CModalHeader>

      <CModalBody className="text-center p-4">
        <p
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px',
            fontFamily: 'Segoe UI, sans-serif',
          }}
        >
          {props.content}
        </p>

        <CRow className="d-flex justify-content-center mt-3">
          <CCol xs="auto">
            <CButton
              style={{
                backgroundColor: color,
                border: 'none',
                minWidth: '100px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                boxShadow: `0 2px 6px ${color}55`,
                color: "white"
              }}
              onClick={
                (props.type === 'sendMail') ? props.sendMailOK :
                (props.type === 'save') ? props.saveOK :
                (props.type === 'owsave') ? props.owsaveOK :
                (props.type === 'confirm') ? props.confirmOK :
                (props.type === 'update') ? props.updateOK :
                (props.type === 'delete') ? props.deleteOK :
                (props.type === 'export') ? props.exportOK :
                (props.type === 'edit') ? props.editOK :
                (props.type === 'remove') ? props.removeOK :
                (props.type === 'rehire') ? props.rehireOK :
                (props.type === 'resign') ? props.resignOK :
                (props.type === 'active') ? props.activeOK : props.inactiveOK
              }
            >
              {props.okButton || 'OK'}
            </CButton>
          </CCol>

          <CCol xs="auto">
            <CButton
              color="secondary"
              variant="outline"
              style={{
                minWidth: '100px',
                fontWeight: '500',
                letterSpacing: '0.5px',
                marginLeft: '10px',
              }}
              onClick={props.cancel}
            >
              {props.cancelButton || 'Cancel'}
            </CButton>
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter
        className="border-0"
        style={{ paddingBottom: '1.5rem' }}
      ></CModalFooter>
    </CModal>
  );
};

export default Confirmation;
