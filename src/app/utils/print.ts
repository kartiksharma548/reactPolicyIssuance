export function CallPrint(innerHTML) {
    var printContent = document.getElementById("ProposalPart");
    var printContentProposalPart_InsuranceAct = document.getElementById("ProposalPart_InsuranceAct");
    var printContentDisclaimer = document.getElementById("disclaimer");
    var windowUrl = 'about:blank';
    var uniqueName = new Date();
    var windowName = 'Print' + uniqueName.getTime();

    var printWindow = window.open(windowUrl, windowName);

    printWindow.document.write('<html>\n');
    printWindow.document.write('<head>\n');

    if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {

    }
    else {
        printWindow.document.write('<link rel="stylesheet" type="text/css" href="../../Content/css/bootstrap-min.css" />,<link rel="stylesheet" type="text/css" href="../../Content/css/bootstrap-min.css" />\n');

    }

    printWindow.document.write('<script>\n');

    if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
        printWindow.document.write('var chromeCss = document.createElement("link");\n');
        printWindow.document.write('chromeCss.rel = "stylesheet";\n');
        printWindow.document.write('chromeCss.href = "../../Common/PrintCanCert.css";\n');
        
        printWindow.document.write('document.getElementsByTagName("head")[0].appendChild(chromeCss);\n');
    }

    printWindow.document.write('function winPrint()\n');
    printWindow.document.write('{\n');
    printWindow.document.write('window.focus();\n');


    if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
        printWindow.document.write('printChrome();\n');
    }
    else {
        printWindow.document.write('window.print();\n');
    }


    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
        printWindow.document.write('window.close();\n');
    }
    else {
        printWindow.document.write('chkstate();\n');
    }
    printWindow.document.write('}\n');


    printWindow.document.write('function chkstate()\n');
    printWindow.document.write('{\n');
    printWindow.document.write('if(document.readyState=="complete")');
    printWindow.document.write('{\n');
    printWindow.document.write('window.close();\n');
    printWindow.document.write('}\n');
    printWindow.document.write('else{\n');
    printWindow.document.write('setTimeout("chkstate();",3000);\n');
    printWindow.document.write('}\n');
    printWindow.document.write('}\n');

    printWindow.document.write('function printChrome()\n');
    printWindow.document.write('{\n');
    printWindow.document.write('if(document.readyState=="complete")');
    printWindow.document.write('{\n');
    printWindow.document.write('window.print();\n');
    printWindow.document.write('}\n');
    printWindow.document.write('else{\n');
    printWindow.document.write('setTimeout("printChrome();",3000);\n');
    printWindow.document.write('}\n');
    printWindow.document.write('}\n');

    printWindow.document.write('</scr');
    printWindow.document.write('ipt>');

    printWindow.document.write('</head>');
    printWindow.document.write('<body onload="winPrint()" >');
    printWindow.document.write('<table cellpadding="1" width="100%" align="center">');
    printWindow.document.write('<tr>');
    printWindow.document.write('<td>');
    printWindow.document.write('<table class="gray_border" align="center">');
    printWindow.document.write('<tr>');
    printWindow.document.write('<td>');
    printWindow.document.write('<div style="height: 100%;">');
    printWindow.document.write(innerHTML);
    // printWindow.document.write(printContentProposalPart_InsuranceAct.innerHTML);
    // printWindow.document.write(printContentDisclaimer.innerHTML);
    printWindow.document.write('</div>');
    printWindow.document.write('</td>');
    printWindow.document.write('</tr>');
    printWindow.document.write('</table>');
    printWindow.document.write('</td>');
    printWindow.document.write('</tr>');
    printWindow.document.write('</table>');
    printWindow.document.write('</body>');
    printWindow.document.write('</html>');
    printWindow.document.close();

}