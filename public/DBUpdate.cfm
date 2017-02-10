<!---This is called using ajax for updating database while editing forms--->
<!--- Use POST to call this page --->
<cfif form.Proc EQ "InsNode">
  <!---InsNode - Inserts new node (form,section,field,etc) to right of (after) given--->
	<cfstoredproc procedure="InsNode" datasource="ITForms">
    <cfprocparam cfsqltype="cf_sql_integer" value="#form.ID#">
    <cfprocparam cfsqltype="cf_sql_varchar" value="#form.Code#">
    <cfprocparam cfsqltype="cf_sql_varchar" value="#form.Type#">
    <cfprocparam cfsqltype="cf_sql_varchar" value="#form.Descrip#">
  </cfstoredproc>
<cfelseif form.Proc EQ "AddChild">
  <!---AddChild - Inserts new node (form,section,field,etc) as first child of given--->
	<cfstoredproc procedure="AddChild" datasource="ITForms">
    <cfprocparam cfsqltype="cf_sql_integer" value="#form.ID#">
    <cfprocparam cfsqltype="cf_sql_varchar" value="#form.Code#">
    <cfprocparam cfsqltype="cf_sql_varchar" value="#form.Type#">
    <cfprocparam cfsqltype="cf_sql_varchar" value="#form.Descrip#">
  </cfstoredproc>
<cfelseif form.Proc EQ "DelNode">
  <!---DelNode - Delete Node and all it's children (Yikes!)--->
	<cfstoredproc procedure="DelNode" datasource="ITForms">
    <cfprocparam cfsqltype="cf_sql_integer" value="#form.ID#">
  </cfstoredproc>
<cfelseif form.Proc EQ "PublishForm">
  <!---PublishForm - Toggles form from Type FORM to UNPUB--->
	<cfstoredproc procedure="PublishForm" datasource="ITForms">
    <cfprocparam cfsqltype="cf_sql_integer" value="#form.ID#">
  </cfstoredproc>  
</cfif>
