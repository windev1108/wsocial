var Gender;
(function (Gender) {
    Gender[Gender["MALE"] = 0] = "MALE";
    Gender[Gender["FEMALE"] = 1] = "FEMALE";
    Gender[Gender["OTHER"] = 2] = "OTHER";
})(Gender || (Gender = {}));
export var TypeNotification;
(function (TypeNotification) {
    TypeNotification[TypeNotification["ADD_FRIEND"] = 0] = "ADD_FRIEND";
    TypeNotification[TypeNotification["FOLLOW_USER"] = 1] = "FOLLOW_USER";
    TypeNotification[TypeNotification["SHARE_POST"] = 2] = "SHARE_POST";
    TypeNotification[TypeNotification["LIKE_POST"] = 3] = "LIKE_POST";
})(TypeNotification || (TypeNotification = {}));
export var Viewer;
(function (Viewer) {
    Viewer[Viewer["PUBLIC"] = 0] = "PUBLIC";
    Viewer[Viewer["FRIENDS"] = 1] = "FRIENDS";
    Viewer[Viewer["PRIVATE"] = 2] = "PRIVATE";
})(Viewer || (Viewer = {}));
