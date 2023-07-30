<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DDLForm.aspx.cs" Inherits="DDLCustomControl.DDLForm" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" dir="rtl">
<head runat="server">
    <title></title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
        <!--ICONS-->
    <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <link href="DDLFormStyle.css" rel="stylesheet" />

</head>
<body>

     <div id="DDLNormalSelect_container">
    </div>

       <div id="DDLSearchedSelect_container">
    </div>
       <div id="DDLMultiSelected_container" >
    </div>
         <div id="DDLTreeView_container">
    </div>
        <div id="DDLMixed_container">
    </div>
</body>
<script src="DDLControlV2.js"></script>
<script src="Index.js"></script>
</html>
