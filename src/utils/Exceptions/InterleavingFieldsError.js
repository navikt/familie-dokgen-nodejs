export default function InterleavingFieldsError(errors){
    this.value = errors[0];
    this.message = "does not conform to set JSON standard";
    this.errorCode = "FieldError";
    this.toString = () => {
        return this.value.toString();
    }
}
