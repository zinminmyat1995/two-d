import React,{useState,useEffect} from 'react'
import ApiPath from "../common/ApiPath";
import { ApiRequest } from "../common/ApiRequest";
import { useLocation } from 'react-router-dom';
import Loading from "../common/Loading"
import ErrorModal from './ErrorModal'
import ProductDetail from './ProductDetail'
import MenuCard from './MenuCard'
import SuccessModal from './SuccessModal'
import { CNavItem } from '@coreui/react'

export default function CustomerViewIndex() {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorText1, setErrorText1] = useState("")
  const [errorText2, setErrorText2] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successText1, setSuccessText1] = useState("")
  const [successText2, setSuccessText2] = useState("")
  const [selectedMenu, setSelectedMenu] = useState("")
  const [main, setMain] = useState([])
  const [menu, setMenu] = useState([])
  const [menuData, setMenuData] = useState([])
  const [page, setPage ] = useState(1)
  const [selectItemData, setSelectItemData ] = useState([]);

  const account = React.useMemo(
    () => pathname.replace(/\/$/, '').split('/').pop(),
    [pathname]
  )

  useEffect(() => {
    (async () => {
      await getData()
    })()
    // eslint-disable-next-line
  }, [])

  const getData = async () => {
    const object = { url: ApiPath.CustomerViewGetData, method: 'get' }
    const response = await ApiRequest(object)
    if (response.flag === false) {
      setLoading(false)
      return
    }
    if (response.data.status === 'OK') {
      const res = response.data.data
      const arr = res.map(d => ({
        component: CNavItem,
        name: d.name,
        to: `/order/register`,
      }))
      setMenu(arr)
      setSelectedMenu(res[0]?.name || '')
      setMain(res)
      setMenuData(res[0]?.data || [])
      setLoading(false)
    }
  }
console.log(selectedMenu)
  const menuClick = (name) => {
    setSelectedMenu(name)
    const res = main.find(item => item.name === name)
    setMenuData(res ? res.data : [])
  }

  
  let cardClick = (name,meats) =>{
    let res = menuData.filter(data=> data.name == name && data.meats == meats)
    setSelectItemData(res)
    setPage(2)
    
  }

  return (
    <div className="page">
      <Loading start={loading} />
      <ErrorModal showError={showError} errorText1={errorText1} errorText2={errorText2} />
      <SuccessModal showSuccess={showSuccess} successText1={successText1} successText2={successText2} />
    {page == 1 &&
       <MenuCard 
            menuData={menuData}
            main={main}
            selectedMenu={selectedMenu }
            cardClick={cardClick}
            menuClick={menuClick}
       />
    }

    {page == 2 &&
        <ProductDetail  
            menuData={menuData}
            selectedMenu={selectedMenu}
            selectItemData={selectItemData}
            back={()=>setPage(1)}
        />
    }

    </div>
  )
}
