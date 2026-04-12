// $Id: $
function getSalesiqPhoneVal(inpElem) {
    var fieldLinkName = inpElem.getAttribute("compname");
    var phoneFormat = inpElem.getAttribute("phoneFormat");
    var salesIQValue = "";

    if (phoneFormat === "1") {
        var isCodeEnabled = inpElem.getAttribute("isCountryCodeEnabled");
        salesIQValue = document.getElementById("international_" + fieldLinkName + "_countrycode").value;
        if (salesIQValue != null && salesIQValue !== "" && isCodeEnabled === "true") {
            salesIQValue = document.getElementById("international_" + fieldLinkName + "_countrycodeval").value + salesIQValue;
        }
    } else if (phoneFormat === "2") {
        var countryCode = document.getElementById(fieldLinkName + "_countrycode").value;
        var first = document.getElementById(fieldLinkName + "_first").value;
        var last = document.getElementById(fieldLinkName + "_second").value;
        salesIQValue = countryCode + first + last;
    }
    return salesIQValue;
}

function replaceCustomVal(zfFieldValueMap) {
  return function replacer(match, fieldName) {
    var key = fieldName.replace('.', '_');
    var value = "";
    if (zfFieldValueMap.hasOwnProperty(fieldName)) {
      value = zfFieldValueMap[fieldName];
    } else if (zfFieldValueMap.hasOwnProperty(key)) {
      value = zfFieldValueMap[key];
    }
    return value !== undefined ? value : match;
  };
}
function zf_addDataToSalesIQ() {

    var visitorinfo = {};
    var zfFieldValueMap = {};
    var elements = document.getElementById("form").elements;
    for (var elmIdx = 0; elmIdx<elements.length;elmIdx++) {
        var inpElem = elements[elmIdx];
        var fieldType = inpElem.getAttribute("fieldType");
        if(fieldType==="1" || fieldType==="7" || fieldType==="9" || fieldType==="11"){
            var nameAttr = inpElem.getAttribute("name");
            if(fieldType==="1"){
                zfFieldValueMap[nameAttr] = inpElem.value;
            }if(fieldType==="7"){
                zfFieldValueMap[nameAttr] = inpElem.value;
            }if(fieldType==="9"){
                zfFieldValueMap[nameAttr] = inpElem.value;
            }if(fieldType==="11"){
                var compLinkAttr = inpElem.getAttribute("compname");
                zfFieldValueMap[compLinkAttr] = getSalesiqPhoneVal(inpElem);
            }
        }
    }
    for (var siqIdx = 0; siqIdx < salesIQFieldsArray.length; siqIdx++) {
        var salesIQObj = salesIQFieldsArray[siqIdx];
        var salesIQFieldName = salesIQObj.salesIQFieldName;
        var zfFieldName = salesIQObj.formFieldName;
        var zfFldCompLinkName = salesIQObj.fieldCompLinkName;
        if (salesIQObj.hasOwnProperty("custom_val")) {
            var replacer = replaceCustomVal(zfFieldValueMap);
            var customVal = salesIQObj.custom_val.replace(/\$\{zf:([^}]+)\}/g, replacer);
        

            if (salesIQFieldName === "FirstName"){
                visitorinfo.firstname = customVal;
            }else if (salesIQFieldName === "Name"){// No I18N
                visitorinfo.name = customVal;
            }else if (salesIQFieldName === "LastName"){// No I18N
                visitorinfo.lastname = customVal;
            } 
        } else {
            var value="";
            if (zfFieldValueMap.hasOwnProperty(zfFieldName)) {
                value = zfFieldValueMap[zfFieldName];
            } else if (zfFieldValueMap.hasOwnProperty(zfFldCompLinkName)) {
                value = zfFieldValueMap[zfFldCompLinkName];
            }
            if (salesIQFieldName === "Phone"){
                visitorinfo.contactnumber = value;
            }else if (salesIQFieldName === "Email"){// No I18N
                visitorinfo.email = value;
            }else if (salesIQFieldName === "Name"){// No I18N
                visitorinfo.name = value;
            }else if (salesIQFieldName === "LastName"){// No I18N
                visitorinfo.lastname = value;
            }else if (salesIQFieldName === "FirstName"){// No I18N
                visitorinfo.firstname = value;
            }else if (salesIQFieldName === "Salutation"){// No I18N
                visitorinfo.salutation = value;
            } 
        }
    }
    parent.postMessage(
        JSON.stringify({ type: 'zoho.salesiq.apimessage', visitor: visitorinfo }),// No I18N
        '*'
    );
}
