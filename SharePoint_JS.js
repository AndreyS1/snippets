
//Set current user to people picker SharePoint 2013 2016 Office 365 classic interface
SP.SOD.executeFunc('clientpeoplepicker.js', 'SPClientPeoplePicker', function () {
    SetAndResolvePeoplePicker('Requester Name', _spPageContextInfo.userLoginName);
});

function SetAndResolvePeoplePicker(fieldName, userAccountName) {

    var controlName = fieldName;
    var peoplePickerDiv = $("[id$='ClientPeoplePicker'][title='" + controlName + "']");
    var peoplePickerEditor = peoplePickerDiv.find("[title='" + controlName + "']");
    var spPeoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerDiv[0].id];

    peoplePickerEditor.val(userAccountName);
    spPeoplePicker.AddUnresolvedUserFromEditor(true);
    spPeoplePicker.SetEnabledState(false);
}
//--------------------------------------------------------------------------------------------

//Hide/disable controls  SharePoint 2013 2016 Office 365 classic interface
$(document).ready(function () {
    //hide
    $("#Details").closest("tr").hide();

    if ($("select[title='Request Status']").val() !== "Need More Info") {
        $("textarea[title='Additional Comments']").closest("tr").hide();
    }

    //readonly PeoplePicker
    SP.SOD.executeFunc('clientpeoplepicker.js', 'SPClientPeoplePicker', function () {
        $("input[title='Requester Name']").prop('disabled', 'disabled');
        $("a[title='Remove person or group Attiq Khan']").hide();
    });
});
//--------------------------------------------------------------------------------------------

//Set fields for admin group SharePoint 2013 2016 Office 365 classic interface
var userGroupTitle = "Team Site Owners";
var userid = _spPageContextInfo.userId;

$(document).ready(function () {
    SetControlsForCurrentUserGroup();
});

function SetControlsForCurrentUserGroup() {

    var clientContext = new SP.ClientContext.get_current();
    var currentUser = clientContext.get_web().get_currentUser();
    clientContext.load(currentUser);

    var userGroups = currentUser.get_groups();
    clientContext.load(userGroups);
    clientContext.executeQueryAsync(OnQuerySucceeded);

    function OnQuerySucceeded() {
        var isMember = false;

        try {
            var groupsEnumerator = userGroups.getEnumerator();
            while (groupsEnumerator.moveNext()) {
                var group = groupsEnumerator.get_current();
                if (group.get_title() === userGroupTitle) {
                    isMember = true;
                    break;
                }
            }
        } catch (ex) {
            ;
        }


        if (isMember) {
            $("select[title='Request Status']").prop('disabled', false);
        }
        else {
            $("select[title='Request Status']").prop('disabled', 'disabled');
        }

    }

    function OnQueryFailed() {

    }
}
//--------------------------------------------------------------------------------------------

//set SharePoint Fields visbility prop
function setFieldVisibility(listTitle, fieldName, properties, success, failure) {
    var ctx = SP.ClientContext.get_current();
    var web = ctx.get_web();
    var list = web.get_lists().getByTitle(listTitle);
    var field = list.get_fields().getByTitle(fieldName);
    field.setShowInDisplayForm(properties.ShowInDisplayForm);
    field.setShowInNewForm(properties.ShowInNewForm);
    field.setShowInEditForm(properties.ShowInEditForm);
    field.set_hidden(properties.Hidden);
    field.set_readOnlyField(properties.ReadOnly);
    field.update();
    ctx.executeQueryAsync(success, failure);
}

var listTitle = 'FieldRequestTracking';
var fieldName = 'Requester Name';
var properties = {
    'ShowInDisplayForm': true,
    'ShowInNewForm': true,
    'ShowInEditForm': true,
    'Hidden': false,
    'ReadOnly': false
};

setFieldVisibility(listTitle, fieldName, properties,
    function () {
        console.log("Field visibility settings has been changed");
    },
    function (sender, args) {
        console.log(args.get_message());
    }
);
//--------------------------------------------------------------------------------------------