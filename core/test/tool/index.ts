

export const objectToBoolean = (value: any): any => {
    for(let obj in value){
        value[obj] = true
    }
    return value;
}