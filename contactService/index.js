// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary

class MyClass {
    contacts = {};
    updateListener = null;
    serviceClass = null;

    constructor(updates, service) {
        this.updateListener = updates;
        this.serviceClass = service;

        this.updateListener.on('add', (id) =>  {
            var promise = this.serviceClass.getById(id);
            promise.then((obj) => {
                this.contacts[id] = obj;
            });
        });
        this.updateListener.on('change', (id, field, value) => {
            this.contacts[id][field] = value;
        });
        this.updateListener.on('remove', (id) => {
            delete this.contacts[id];
        });
    }

    search(query) {

        const reformatNumber = (num) => {
            if (!num?.length) {
                return '';
            }
            else {
                let newNum = num.replace( /\D+/g, '');
                if (newNum.length > 10) {
                    newNum = newNum.substring(1);
                }
                return `(${newNum.slice(0, 3)}) ${newNum.slice(3, 6)}-${newNum.slice(6, 10)}`;
            }
        }

        const sanitize = (obj) => {
            const first = obj.nickName ? obj.nickName : obj.firstName;
            let numbers = [];
            const primary = reformatNumber(obj.primaryPhoneNumber);
            const secondary = reformatNumber(obj.secondaryPhoneNumber);
            if (primary.length) {
                numbers.push(primary);
            }
            if (secondary.length) {
                numbers.push(secondary);
            }
            const newObject = {
                id: obj.id,
                name: `${first} ${obj.lastName}`,
                phones: numbers,
                email: obj.primaryEmail,
                address: `${obj.addressLine1}${obj.addressLine2}${obj.addressLine3}`
            }
            return newObject;
}
        let results = [];
        for (let contactId in this.contacts) { 
            let contact = this.contacts[contactId];
            for (let field in contact) { 
                if (contact[field].includes(query) && field !== "primaryPhoneNumber" && field !== "secondaryPhoneNumber") { 
                    results.push(sanitize(contact));
                }
            }

            const sanQuery = query.replace(/[^0-9]+/ig, "");
            const sanPrimary = contact.primaryPhoneNumber.replace(/[^0-9]+/ig, "");
            const sanSecondary = contact.secondaryPhoneNumber.replace(/[^0-9]+/ig, "");
            if (sanQuery && (sanPrimary.includes(sanQuery) || (sanSecondary.includes(sanQuery)))) {
                results.push(sanitize(contact));
            }
            if (contact.firstName + " " + contact.lastName === query || contact.nickName + " " + contact.lastName === query) {
                results.push(sanitize(contact));
            }
        }

        return results;
    }
}


export default MyClass;
