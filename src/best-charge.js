
function bestCharge() {
  let data = getLocalData();
  let selectedItems = getSelectedItems(data);

  let sumMoney = sum(selectedItems);
  function sum(selectedItems) {
    let sumMoney = 0;
    for (item of selectedItems) {
      sumMoney += item.count * item.price;
    }

    return sumMoney;
  }
  
  let resultObject;
  if (sumMoney >= 30) {
    resultObject = getDiscountOrHalfPrice(selectedItems, sumMoney);
  } else {
    resultObject = getHalfPriceOrOriginPrice(selectedItems, sumMoney);
  }
  return resultObject;


  function getDiscountOrHalfPrice(selectedItems, sumMoney) {
    let laingPi =  selectedItems.filter(item => item.id === "ITEM0022");
    let huangMengji = selectedItems.filter(item => item.id === "ITEM0001");

    if (laingPi.length === 1 && huangMengji === []) {
      let resultObject = onlyContentLiangPi(selectedItems, sumMoney);
      return resultObject;

    } else if (laingPi === [] && huangMengji.length === 1) {
      let resultObject = onlyContentHuangMengJi(selectedItems, sumMoney);
      return resultObject;

    } else if (laingPi.length === 1 && huangMengji.length === 1) {
      let resultObject = contentBothFoods(selectedItems, sumMoney);
      return resultObject;

    } else {
      let resultObject = contentNoHalfPriceFood(selectedItems, sumMoney);
      return resultObject;
    }


    function onlyContentLiangPi(selectedItems, sumMoney) {
      let targetItem = selectedItems.filter(item => item.id === "ITEM0022");
      let withHalfPriceMoney = sumMoney - targetItem.price * 0.5 * targetItem.count;
  
      let withDiscountMoney = sumMoney - 6;
  
      if (withDiscountMoney >= withHalfPriceMoney) {
        return {"money": withHalfPriceMoney, "type": "manJian"};
        // return [sumMoney, "banJia"];
      } else {
        return {"money": withDiscountMoney, "type": "banJia"};
        // return [sumMoney, "banJia"];
      }
    }
  
    function onlyContentHuangMengJi(selectedItems, sumMoney) {
      let targetItem = selectedItems.filter(item => item.id === "ITEM0001");
      let withHalfPriceMoney  = sumMoney - targetItem.price * 0.5 * targetItem.count;
  
      let withDiscountMoney = sumMoney - 6;
  
      if (withDiscountMoney >= withHalfPriceMoney) {
        return {"money": withHalfPriceMoney, "type": "manJian"};
        // return [sumMoney, "manJian"];
      } else {
        return {"money": withDiscountMoney, "type": "banJia"};
        // return [sumMoney, "banJia"];
      }
    }
  
    function contentBothFoods(selectedItems, sumMoney) {
      let targetItem = selectedItems.filter(item => item.id === "ITEM0001" | item.id === "ITEM0022");
      let withHalfPriceMoney = sumMoney - targetItem[0]["price"] * 0.5 * targetItem[0]["count"] - targetItem[1]["price"] * 0.5 * targetItem[1]["count"];
  
      let withDiscountMoney = sumMoney - 6;
  
      if (withDiscountMoney >= withHalfPriceMoney) {
        return {"money": withHalfPriceMoney, "type": "manJian"};
        // return [sumMoney, "manJian"];

      } else {
        return {"money": withDiscountMoney, "type": "banJia"};
        // return [sumMoney, "banJia"];
      }
    }
  
    function contentNoHalfPriceFood(selectedItems, sumMoney) {
      let withDiscountMoney = sumMoney -6;
  
      return {"money": withDiscountMoney, "type": "manJian"};
      // return [sumMoney, "manJian"];
    }
  }



  function getHalfPriceOrOriginPrice(selectedItems, sumMoney) {
    let laingPi =  selectedItems.filter(item => item.id === "ITEM0022");
    let huangMengji = selectedItems.filter(item => item.id === "ITEM0001");

    if (laingPi.length === 1 && huangMengji === []) {
      onlyContentLiangPi(selectedItems, sumMoney);
    } else if (laingPi === [] && huangMengji.length === 1) {
      onlyContentHuangMengJi(selectedItems, sumMoney);
    } else if (laingPi.length === 1 && huangMengji.length === 1) {
      contentBothFoods(selectedItems, sumMoney);
    } else {
      contentNoHalfPriceFood(selectedItems, sumMoney);
    }


    function onlyContentLiangPi(selectedItems, sumMoney) {
      let targetItem = selectedItems.filter(item => item.id === "ITEM0022");
      let withHalfPriceMoney = sumMoney - targetItem.price * 0.5 * targetItem.count;
      
      return {"money": withHalfPriceMoney, "type": "banJia"};
      // return [sumMoney, "banJia"];
    }
  
    function onlyContentHuangMengJi(selectedItems, sumMoney) {
      let targetItem = selectedItems.filter(item => item.id === "ITEM0001");
      let withHalfPriceMoney  = sumMoney - targetItem.price * 0.5 * targetItem.count;

      return {"money": withHalfPriceMoney, "type": "banJia"};
      // return [sumMoney, "banJia"];
    }
  
    function contentBothFoods(selectedItems, sumMoney) {
      let targetItem = selectedItems.filter(item => item.id === "ITEM0001" | item.id === "ITEM0022");
      let withHalfPriceMoney = sumMoney - targetItem[0]["price"] * 0.5 * targetItem[0]["count"] - targetItem[1]["price"] * 0.5 * targetItem[1]["count"];
  
      return {"money": withHalfPriceMoney, "type": "manJian"};
      // return [sumMoney, "manJian"];
    }
  
    function contentNoHalfPriceFood(selectedItems, sumMoney) {
      return {"money": sumMoney, "type": "none"};
      // return [sumMoney, "none"];
    }
  }

}

module.exports.bestCharge = bestCharge;
