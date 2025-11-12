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
import OrderList from './OrderList';

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
  const [orderList, setOrderList ] = useState([]);

  const account = React.useMemo(
    () => pathname.replace(/\/$/, '').split('/').pop(),
    [pathname]
  )

  useEffect(() => {
    (async () => {
      setLoading(true)
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

    const plusBtn = (SubId,Id,id,name) => {

        const updatedMenu = menuData.map(d => {
          if (d.menu_id !== Id) return d;
  
          
          const updatedMeats = d.meats.map(meat => {
            if (meat.menu_sub_id == SubId && meat.id == id) {
              return { ...meat, count: meat.count + 1 };
            }
            return meat;
          });
  
          // menu.count = meats.count အပေါင်း
          const totalCount = updatedMeats.reduce((acc, m) => acc + m.count, 0);
  
          return {
            ...d,
            meats: updatedMeats,
            count: totalCount
          };
        });


        let res = updatedMenu.filter(data=> data.name == name)
        setSelectItemData(res)
        setMenuData(updatedMenu);
  
        // find selected meat
        let selected;
        updatedMenu.some(menu => {
          const found = menu.meats.find(m => m.id == id && m.menu_sub_id == SubId);
          if (found) {
            selected = { ...found, price: found.price, name: menu.name, meat: found.name };
            return true; // stop looping
          }
          return false;
        });
        if (!selected) return;
  
        setOrderList(prev => {
          const exists = prev.find(item => item.id == id && item.menu_id == Id && item.menu_sub_id == SubId);
  
          if (exists) {
            return prev.map(item =>
              item.id == id && item.menu_id == Id && item.menu_sub_id == SubId ? { ...item, count: selected.count } : item
            );
          } else {
            return [
              ...prev,
              {
                id: selected.id,
                name: selected.name,
                price: selected.price,
                count: selected.count,
                meat: selected.meat,
                menu_id: Id,
                menu_sub_id: SubId,
              }
            ];
          }
        });
  
        setMain(prev => {
          return prev.map(item =>
            item.name == selectedMenu
              ? { ...item, data: updatedMenu }
              : item
          );
        });
    };
  

    const minusBtn = (SubId,Id,id, name) => {
        const updatedMenu = menuData.map(d => {
            if (d.menu_id !== Id) return d;
    
            // menu ထဲမှာ meats update
            const updatedMeats = d.meats.map(meat =>
              meat.id == id && d.menu_id == Id && meat.menu_sub_id == SubId? { ...meat, count: Math.max(0, meat.count - 1)  } : meat
            );
    
            return {
              ...d,
              meats: updatedMeats,
            };
          });
    
          let res = updatedMenu.filter(data=> data.name == name)
          setSelectItemData(res)
          setMenuData(updatedMenu);
    
    
        setOrderList(prev =>
          prev
            .map(item =>
              item.id == id && item.menu_id == Id && item.menu_sub_id == SubId
                ? { ...item, count: Math.max(0, item.count - 1) }
                : item
            )
            .filter(item => item.count > 0) 
        );
      };

console.log("order list",orderList)

  const plusDailyBtn = (SubId,Id,name) => {

      const updatedMenu = menuData.map(d => {
        if (d.menu_id == Id && d.menu_sub_id == SubId){
          return {
            ...d,
            meats: [],
            count: d.count + 1,
          };
        }else{
          return d;
        } 
      });

      console.log("updatedMenu ",updatedMenu)
      let res = updatedMenu.filter(data=> data.name == name)

      setSelectItemData(res)
      setMenuData(updatedMenu);
      
      let selected;

      updatedMenu.some(menu => {
        if (menu.menu_sub_id == SubId && menu.menu_id == Id) {
          selected = { 
            ...menu, 
            price: menu.price, 
            name: menu.name,
            meat: null,
            id: menu.menu_sub_id
          };
          return true; 
        }
        return false;
      });
      if (!selected) return;


      setOrderList(prev => {
        const exists = prev.find(item => item.menu_id == Id && item.menu_sub_id == SubId); 
        if (exists) {
          return prev.map(item =>
             item.menu_id == Id && item.menu_sub_id == SubId ? { ...item, count: selected.count } : item
          );
        } else {
          return [
            ...prev,
            {
              id: selected.id,
              name: selected.name,
              price: selected.price,
              count: selected.count,
              meat: selected.meat,
              menu_id: Id,
              menu_sub_id: SubId,
            }
          ];
        }
      });

      setMain(prev => {
        return prev.map(item =>
          item.name == selectedMenu
            ? { ...item, data: updatedMenu }
            : item
        );
      });
  };


    const minusDailyBtn = (SubId,Id, name) => {
              
     const updatedMenu = menuData.map(d => {
          if (d.menu_id == Id && d.menu_sub_id == SubId){
            return {
              ...d,
              count: Math.max(0, d.count - 1),
            };
          }else{
            return d;
          }   
        });
  
        let res = updatedMenu.filter(data=> data.name == name)
        setSelectItemData(res)
        setMenuData(updatedMenu);
  
      setOrderList(prev =>
        prev
          .map(item =>
             item.menu_id == Id && item.menu_sub_id == SubId
              ? { ...item, count: Math.max(0, item.count - 1) }
              : item
          )
          .filter(item => item.count > 0) 
      );
    };

    const totalPrice = orderList.reduce((sum, i) => sum + i.count * i.price, 0);
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
            basketclick={()=>setPage(3)}
       />
    }

    {page == 2 &&
        <ProductDetail  
            menuData={menuData}
            selectedMenu={selectedMenu}
            selectItemData={selectItemData}
            back={()=>setPage(1)}
            plusBtn={plusBtn}
            minusBtn={minusBtn}
            plusDailyBtn={plusDailyBtn}
            minusDailyBtn={minusDailyBtn}
            totalPrice={totalPrice}
            reviewOrder={()=>setPage(3)}
            
        />
    }

    {page == 3 &&
        <OrderList  
          back={()=>setPage(1)}
          orderList={orderList}
        />
    }

    </div>
  )
}
