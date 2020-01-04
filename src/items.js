loadAllItems();
function loadAllItems() {
  let rawData =  [{
    id: 'ITEM0001',
    name: '黄焖鸡',
    price: 18.00
  }, {
    id: 'ITEM0013',
    name: '肉夹馍',
    price: 6.00
  }, {
    id: 'ITEM0022',
    name: '凉皮',
    price: 8.00
  }, {
    id: 'ITEM0030',
    name: '冰锋',
    price: 2.00
  }];

  let rawDataWithCount = addCountAttribute(rawData);
  putRawDataIntoLocalStorage(rawDataWithCount);
}

function addCountAttribute(data) {
  for (let item of data) {
    item.count  = 0;
  }
  return data;
}

function putRawDataIntoLocalStorage(data) {
  let storage = window.localStorage;

  let dataStr = JSON.stringify(data);
  storage.setItem("foodData", dataStr);
}