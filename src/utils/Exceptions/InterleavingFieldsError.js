export default function InterleavingFieldsError(errors){
    this.value = errors;
    this.message = "does not conform to set JSON standard";
    this.errorCode = "FieldError";
    this.toString = () => {
        return this.value.toString();
    }
}
