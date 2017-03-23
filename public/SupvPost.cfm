<cfdump var="#form#">
<cfset ItemStr = "<reqrows>">
<cfloop collection="#form#" item="theField">
  <cfif theField NEQ "fieldNames" AND theField NEQ "DateEntered" AND theField NEQ "LoggedInName" AND theField NEQ "SupvSig">
  <cfset ItemStr = ItemStr & "<row><Field>#theField#</Field><Value>#form[theField]#</Value></row>" >
  </cfif>
</cfloop>
<cfset ItemStr = ItemStr & "</reqrows>">


<cfset LoggedInName = form.LoggedInName & " - Signature:" & form.SupvSig>


<cfstoredproc procedure="UpsertRequest" datasource="ITForms">
  <cfprocparam cfsqltype="cf_sql_varchar" value="#LoggedInName#">
  <cfprocparam cfsqltype="cf_sql_varchar" value="#ItemStr#">
  <cfprocparam cfsqltype="cf_sql_integer" null="true">
  <cfprocresult name="reqid">
</cfstoredproc>



<div style="text-align:center;padding-top:100px;">
  You have successfully submitted a <b>Computer Access Authorization E-Form.<br>
  <div>
    <a href="EmailSelf.cfm">Click here to email a copy to yourself</a> 
  </div>
  <a href="https://ccp1.msj.org/login/login/CompAccess/">Computer Access Form ADMIN</a><br> 
  <a href="https://ccp1.msj.org/login/login/home.cfm">Intranet login menu</a><br> 
</div>
