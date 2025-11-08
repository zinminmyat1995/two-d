import React from 'react'
import { CModal, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react'

const OrderDetailModal = ({ show, onClose, orderList, tax, discount }) => {

    const subtotal  = orderList.reduce((sum, i) => sum + i.count * i.original_price, 0);
    // calculate tax amount
    const taxAmount = (subtotal  * tax) / 100;

    // calculate discount amount
    const discountAmount = (subtotal  * discount) / 100;

    // calculate final total
    const total = subtotal  + taxAmount - discountAmount;
  return (
    <>
      <CModal
        alignment="center"
        visible={show}
        size="xl"
        backdrop="static"
        aria-labelledby="OrderDetailModal"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '70vw',          // ✅ full screen width 90%
            maxWidth: '1280px',     // ✅ bigger than xl
            maxHeight: '80vh',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 10px 35px rgba(0,0,0,0.25)',
            padding: '25px 25px 15px',
            display: 'flex',
            flexDirection: 'column',
            animation: 'zoomIn 0.4s ease-in-out',
          }}
        >
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h5
              style={{
                fontWeight: '700',
                color: '#2f3542',
                fontSize: '20px',
                marginBottom: '5px',
              }}
            >
              🧾 Order Detail
            </h5>
            <div
              style={{
                width: '50px',
                height: '3px',
                margin: '0 auto',
                background: 'linear-gradient(135deg, #6c5ce7, #0984e3)',
                borderRadius: '2px',
              }}
            ></div>
          </div>

           
            <div className='table-responsive tableFixHead'>
                <table className='table menu-list-table'>
                    <thead className="text-center">
                        <tr>
                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="50px" >No</th>
                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="130px" >Menu Name</th>
                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="130px0px">Meat Name</th>
                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="100px">Price</th>
                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="50px">Count</th>
                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="100px">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                    {orderList.length > 0 &&
                        orderList.map((item, index) => (
                        <tr
                            key={index}
                            style={{ transition: "0.3s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fff4")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <td>{index + 1}</td>
                            <td>{item.menu_name}</td>
                            <td>{item.meat_name}</td>
                            <td>฿{item.price}</td>
                            <td>{item.count}</td>
                            <td>฿{(item.price * item.count)}</td>
                            
                        </tr>
                    ))}
                    </tbody>
                </table>
              <div
                style={{
                  // borderTop: '1px solid #f1f2f6',
                  padding: '15px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  // backgroundColor: '#fff',
                  // borderRadius: '8px',
                  // boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  marginTop: '20px',
                  gap: '6px',
                  width: '100%',
                }}
              >
                {[
                  { label: 'Subtotal:', value: subtotal?.toFixed(2) || '0.00', strong: false },
                  { label: `Tax ${tax || 0}%:`, value: taxAmount?.toFixed(2) || '0.00', strong: false },
                  { label: `Discount ${discount || 0}%:`, value: discountAmount?.toFixed(2) || '0.00', strong: false, isDiscount: true },
                  { label: 'Total:', value: total?.toFixed(2) || '0.00', strong: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'baseline',
                      width: '280px',
                      maxWidth: '90%',
                      gap: '8px',
                    }}
                  >
                    <h6
                      style={{
                        flex: '1 1 auto',
                        textAlign: 'right',
                        fontWeight: item.strong ? 700 : 600,
                        color: item.strong ? '#2f3542' : '#57606f',
                        margin: 0,
                        fontSize: item.strong ? '17px' : '15px',
                      }}
                    >
                      {item.label}
                    </h6>

                    <h5
                      style={{
                        flex: '0 0 100px',
                        textAlign: 'right',
                        fontWeight: item.strong ? 700 : 600,
                        color: item.strong ? '#000' : '#2f3542',
                        margin: 0,
                        fontSize: item.strong ? '17px' : '15px',
                      }}
                    >
                      {/* ✅ Discount အတွက် '-' ကို ငွေပမာဏရှေ့မှာ ထည့် */}
                      {item.isDiscount ? `-฿${item.value}` : `฿${item.value}`}
                    </h5>
                  </div>
                ))}

              </div>
            </div>
                
   

          {/* Footer Buttons */}
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
            }}
          >
            <CButton className="login-button" style={{ width: "100px" }} onClick={() => onClose()}>Close</CButton>
          </div>
        </div>

      </CModal>
    </>
  )
}

export default OrderDetailModal
