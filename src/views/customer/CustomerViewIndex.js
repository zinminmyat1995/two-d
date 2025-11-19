import React,{useState,useEffect} from 'react'
import ApiPath from "../common/ApiPath";
import { ApiRequest } from "../common/ApiRequest";
import { useLocation } from 'react-router-dom';
import Loading from "../common/Loading"
import ErrorModal from './ErrorModal'
import ConfirmModal from '../order/order/ConfirmModal';
import ProductDetail from './ProductDetail'
import MenuCard from './MenuCard'
import SuccessModal from './SuccessModal'
import { CNavItem } from '@coreui/react'
import OrderList from './OrderList';
import { Base64 } from "js-base64";
import NotFound from './NotFound';
import ConfirmList from './ConfirmList'
import Key from '../common/CommonKey'
export default function CustomerViewIndex() {

  const url = Key.IMAGE_URL;

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
  const [menuData, setMenuData] = useState([])
  const [page, setPage ] = useState(0)
  const [selectItemData, setSelectItemData ] = useState([]);
  const [orderList, setOrderList ] = useState([]);
  const [tableNo, setTableNo ] = useState("")
  const [tableID, setTableID ] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [search, setSearch ] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(search); 
  const [searchData, setSearchData ] = useState([])
  const [copyMenuData, setCopyMenuData ] = useState([]);
  const [copySelectMenu, setCopySelectMenu ] = useState("")

  const [showRating, setShowRating] = useState(false)
  const [activeItem, setActiveItem] = useState(null)
  const [selectedStars, setSelectedStars] = useState(0)
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  const [selectedMenu1, setSelectedMenu1] = useState("")
  const [main1, setMain1] = useState([])
  const [menuData1, setMenuData1] = useState([])
  const [confirmListShow, setConfirmListShow ] = useState(false)
  const [confirmListData, setConfirmListData ] = useState([])

  const account = React.useMemo(
    () => pathname.replace(/\/$/, '').split('/').pop(),
    [pathname]
  )

  useEffect(() => {
    (async () => {
      setLoading(true)
      await checkAcc();
    })()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search); // 4s အပြီးမှ update
    }, 2000);

    return () => clearTimeout(timer); // user တစ်ချက်ချင်း reset
  }, [search]);

  useEffect(() => {
    setSearch(debouncedSearch)
    if(debouncedSearch == ""){
      setMenuData(main[0]?.data || []);
      setSearchData([]);setSelectedMenu(main[0]?.name || '')
    }else{
      const results = searchDishesByNameOrMeat(main, debouncedSearch);
      setSelectedMenu(results[0]?.categoryName || '');
      setMenuData(results);setSearchData(results);
    }
    
  }, [debouncedSearch]);

  console.log("select menu",selectedMenu)
  console.log("search data",searchData)
  console.log("debouncedSearch",debouncedSearch)

console.log("menu data",menuData)
  let checkAcc =async ()=>{
    setLoading(true);
    let object = {
      url: ApiPath.CustomerViewAccCheck,
      method: 'get',
      params: {
        "account": account
      }
    }
  
    let response = await ApiRequest(object);
    if (response.flag === false) {
        setPage(4);setLoading(false);
    } else {
      if (response.data.status === 'OK') {
        setTableNo(response.data.data[0]['name']);setTableID(response.data.data[0]['id'])
        setPage(1);getData();
      } else {
        setPage(4);setLoading(false);
      }
    }
  }

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
      setSelectedMenu(res[0]?.name || '');setSelectedMenu1(res[0]?.name || '');
      setMain(res);setMain1(res)
      setMenuData(res[0]?.data || []);setMenuData1(res[0]?.data || []);
      setLoading(false);
    }
  }

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

    const plusBtn = (SubId,Id,id,name,status) => {

      let updatedMenu=[];let selMenu = selectedMenu;
    if(status == undefined){
        
        updatedMenu = menuData.map(d => {
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
    }else{
      let filterData = main.find((menu) => menu.id === Id)?.data || [];
      let n = main.find((menu) => menu.id === Id)?.name || [];
      selMenu = n;
      
        updatedMenu = filterData.map(d => {
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
    }

        

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
        let result = updatedMenu.filter(d=> d.name == name && d.menu_id == Id)


        setMain(prev =>
          prev.map(item => {

            if (item.name === result[0].categoryName) {
              return {
                ...item,
                data: item.data.map(d => {
                  if (d.menu_id === result[0].menu_id && d.name === result[0].name) {
                    return {
                      ...d,
                      meats: result[0].meats   // ← “mests” typo ကို “meats” ပြင်ထားပါတယ်
                    };
                  }
                  return d;
                })
              };
            }
            return item;
          })
        );

    };
  
    const plusDailyBtn = (SubId,Id,name,status) => {

      let updatedMenu=[];let selMenu = selectedMenu;

      if(status == undefined){
          updatedMenu = menuData.map(d => {
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
      }else{
        let n = main.find((menu) => menu.id === Id)?.name || [];
        selMenu = n;
        
        updatedMenu = menuData.map(d => {
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
      }


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

        let result = updatedMenu.filter(d=> d.name == name && d.menu_id == Id)

        setMain(prev =>
          prev.map(item => {
            if (item.name == result[0].categoryName) {
              return {
                ...item,
                data: item.data.map(d => {
                  if (d.menu_id === result[0].menu_id && d.name === result[0].name) {
                    return {
                      ...d,
                      count: result[0].count
                    };
                  }
                  return d;
                })
              };
            }
            return item;
          })
        );
    };

    const minusBtn = (SubId,Id,id, name, status) => {
      let updatedMenu=[];let selMenu = selectedMenu;

      if(status == undefined){
          updatedMenu = menuData.map(d => {
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
        }else{
          let filterData = main.find((menu) => menu.id === Id)?.data || [];
          let n = main.find((menu) => menu.id === Id)?.name || [];
          selMenu = n;
          
            updatedMenu = filterData.map(d => {
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
        }

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

        let result = updatedMenu.filter(d=> d.name == name && d.menu_id == Id)


        setMain(prev =>
          prev.map(item => {

            if (item.name === result[0].categoryName) {
              return {
                ...item,
                data: item.data.map(d => {
                  if (d.menu_id === result[0].menu_id && d.name === result[0].name) {
                    return {
                      ...d,
                      meats: result[0].meats
                    };
                  }
                  return d;
                })
              };
            }
            return item;
          })
        );
      };

    const minusDailyBtn = (SubId,Id, name, status) => {
      let updatedMenu=[];let selMenu = selectedMenu;

      if(status == undefined){
          updatedMenu = menuData.map(d => {
          if (d.menu_id == Id && d.menu_sub_id == SubId){
            return {
              ...d,
              count: Math.max(0, d.count - 1),
            };
          }else{
            return d;
          }   
        });
    }else{
  
      let n = main.find((menu) => menu.id === Id)?.name || [];
      selMenu = n;

       updatedMenu = menuData.map(d => {
          if (d.menu_id == Id && d.menu_sub_id == SubId){
            return {
              ...d,
              count: Math.max(0, d.count - 1),
            };
          }else{
            return d;
          }   
        });
    }

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

      let result = updatedMenu.filter(d=> d.name == name && d.menu_id == Id)

        setMain(prev =>
          prev.map(item => {
        
            if (item.name === result[0].categoryName) {
              return {
                ...item,
                data: item.data.map(d => {
                  if (d.menu_id === result[0].menu_id && d.name === result[0].name) {
                    return {
                      ...d,
                      count: result[0].count
                    };
                  }
                  return d;
                })
              };
            }
            return item;
          })
        );
    };

    const deleteBtn = (SubId,Id,id, name, status) => {
      let updatedMenu=[];let selMenu = selectedMenu;

      if(status == undefined){
          updatedMenu = menuData.map(d => {
            if (d.menu_id !== Id) return d;
    
            // menu ထဲမှာ meats update
            const updatedMeats = d.meats.map(meat =>
              meat.id == id && d.menu_id == Id && meat.menu_sub_id == SubId? { ...meat, count: 0 } : meat
            );
    
            return {
              ...d,
              meats: updatedMeats,
            };
          });
    }else{
      let name = main.find((menu) => menu.id === Id)?.name || [];
      selMenu = name;
        updatedMenu = menuData.map(d => {
            if (d.menu_id !== Id) return d;
    
            // menu ထဲမှာ meats update
            const updatedMeats = d.meats.map(meat =>
              meat.id == id && d.menu_id == Id && meat.menu_sub_id == SubId? { ...meat, count: 0 } : meat
            );
    
            return {
              ...d,
              meats: updatedMeats,
            };
          });
    }

          let res = updatedMenu.filter(data=> data.name == name)
          setSelectItemData(res)
          setMenuData(updatedMenu);
    
    
        setOrderList(prev =>
          prev
            .map(item =>
              item.id == id && item.menu_id == Id && item.menu_sub_id == SubId
                ? { ...item, count: 0 }
                : item
            )
            .filter(item => item.count > 0) 
        );

        let result = updatedMenu.filter(d=> d.name == name && d.menu_id == Id)

        setMain(prev =>
          prev.map(item => {
            if (item.name === result[0].categoryName) {
              return {
                ...item,
                data: item.data.map(d => {
                  if (d.menu_id === result[0].menu_id && d.name === result[0].name) {
                    return {
                      ...d,
                      meats: result[0].meats
                    };
                  }
                  return d;
                })
              };
            }
            return item;
          })
        );
      };


      const deleteDailyBtn = (SubId,Id, name, status) => {
          let updatedMenu=[];let selMenu = selectedMenu;

          if(status == undefined){
              updatedMenu = menuData.map(d => {
              if (d.menu_id == Id && d.menu_sub_id == SubId){
                return {
                  ...d,
                  count: 0,
                };
              }else{
                return d;
              }   
            });
        }else{
         
          let name = main.find((menu) => menu.id === Id)?.name || [];
          selMenu = name;

          updatedMenu = menuData.map(d => {
              if (d.menu_id == Id && d.menu_sub_id == SubId){
                return {
                  ...d,
                  count: 0,
                };
              }else{
                return d;
              }   
            });
        }

            let res = updatedMenu.filter(data=> data.name == name)
            setSelectItemData(res)
            setMenuData(updatedMenu);
      
          setOrderList(prev =>
            prev
              .map(item =>
                item.menu_id == Id && item.menu_sub_id == SubId
                  ? { ...item, count: 0}
                  : item
              )
              .filter(item => item.count > 0) 
          );

          let result = updatedMenu.filter(d=> d.name == name && d.menu_id == Id)

          setMain(prev =>
            prev.map(item => {
              if (item.name === result[0].categoryName) {
                return {
                  ...item,
                  data: item.data.map(d => {
                    if (d.menu_id === result[0].menu_id && d.name === result[0].name) {
                      return {
                        ...d,
                        meats: result[0].meats
                      };
                    }
                    return d;
                  })
                };
              }
              return item;
            })
          );
        };


    const totalPrice = orderList.reduce((sum, i) => sum + i.count * i.price, 0);

    let saveOK =async ()=>{
        setShowConfirm(false);setLoading(true);let obj = "";
         obj = {
            method: "post",
            url: ApiPath.CustomerViewOrderRegister,
            params: {
              "order_type": 0,
              "table_id": tableID,
              "data": orderList,
              "total_amount": totalPrice,
              "login_id": tableNo,
            },
          };
    
        let response = await ApiRequest(obj);
        
        if (response.flag == false) {
          setLoading(false);
          setShowError(true)
          setErrorText2(response.message[0])
          setErrorText1("Fail to save!");setTimeout(() => setShowError(false), 2000)
        } else {
          if (response.data.status == "OK") {
            setLoading(false);setSelectedMenu(selectedMenu1);setMain(main1);setMenuData(menuData1);
            setShowSuccess(true)
            setSuccessText2([response.data.message]);
            setSuccessText1("Success!");setOrderList([]);setPage(1);setTimeout(() => setShowSuccess(false), 3000)
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }else{
              setErrorText1("Fail to save!");setShowError(true);setErrorText2([response.data.message]);setLoading(false);
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setTimeout(() => setShowError(false), 2000)
          } 
        }
      }

      // return type: dish object အပြည့် (original data structure ကို မပြောင်း)
      function searchDishesByNameOrMeat(resultData, search) {
        const term = (search ?? "").trim().toLowerCase();
        if (!term) return [];

        const matches = [];

        for (const category of resultData) {
          const list = Array.isArray(category.data) ? category.data : [];
          for (const item of list) {
            const name = (item.name ?? "").toLowerCase();
            if (name.includes(term)) {
              matches.push({
                categoryId: category.id,
                categoryName: category.name,
                ...item,
              });
            }
          }
        }

        return matches;
      }

    const closeRating =async (status) => {
      if(status == "btn"){
        if(selectedStars > 0){
          setLoading(true);
          let object = {
            url: ApiPath.CustomerViewRating,
            method: 'post',
            params: {
              "rate": selectedStars,
              "id": activeItem.menu_sub_id
            }
          }
        
          let response = await ApiRequest(object);
          if (response.flag === false) {
              setPage(4);setLoading(false);
          } else {
            if (response.data.status === 'OK') {
              setShowRating(false);setLoading(false);
              setActiveItem(null)
              setSelectedStars(0)
              setShowRatingSuccess(true);
              setTimeout(() => {
                setShowRatingSuccess(false);
              }, 2000);

            } else {
              setPage(4);setLoading(false);
            }
          }

        }else{
          setShowRating(false);
        }
      }else{
        setShowRating(false);
      }
     
    }

    const openRating = (item) => {
      setActiveItem(item)
      setSelectedStars(0)
      setShowRating(true)
    }

    const handleStarClick = (value) => {
      setSelectedStars(value)
      
    }

    let listBtn = async () =>{
        setLoading(true);
        let object = {
          url: ApiPath.CustomerViewOrderConfirm,
          method: 'get',
          params: {
            "table_id": tableID
          }
        }
      
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setPage(5);setLoading(false);setConfirmListData([]);
        } else {
          if (response.data.status === 'OK') {
            setConfirmListData(response.data.order_list);
            setPage(5);setLoading(false);
          } else {
            setPage(4);setLoading(false);
          }
        }

    }

    console.log("STAR",activeItem)
  return (
    <div className="page">
      <Loading start={loading} />
      
      <ConfirmModal
          showConfirm={showConfirm}
          onOk={() =>saveOK()}
          onCancel={() => setShowConfirm(false)}
        />
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
            search={search}
            searchChange={(e)=>setSearch(e.target.value)}
            debouncedSearch={debouncedSearch}
            searchData={searchData}
            closeRating={closeRating}
            showRating={showRating}    
            setShowRating={()=>setShowRating(true)} 
            activeItem={activeItem}
            setActiveItem={()=>setActiveItem(item)}
            selectedStars={selectedStars}
            openRating={openRating}
            handleStarClick={handleStarClick}
            showRatingSuccess={showRatingSuccess}
            listBtn={listBtn}
            url={url}
            
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
          tableNo={tableNo}
          totalPrice={totalPrice}
          plusDailyBtn={plusDailyBtn}
          minusDailyBtn={minusDailyBtn}
          minusBtn={minusBtn}
          plusBtn={plusBtn}
          deleteBtn={deleteBtn}
          deleteDailyBtn={deleteDailyBtn}
          orderClick={()=> setShowConfirm(true)}
        />
    }
    {page == 4 &&
      <NotFound  />
    }

    {page == 5 &&
        <ConfirmList  
          back={()=>setPage(1)}
          confirmListData={confirmListData}
          tableNo={tableNo}
          url={url}
        />
    }

    </div>
  )
}
