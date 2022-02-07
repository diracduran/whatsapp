export const getRecepientEmail = (users, logedInUser) => (
    users?.filter(userToFilter => userToFilter !== logedInUser?.email)[0]
);
