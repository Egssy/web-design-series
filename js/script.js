const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const nonEmptyTextRegex = /^(?!\s*$).+/;

function requiresValidation(field) {
    return (
        !(field.hasAttribute("readonly") || field.readonly) &&
        !(field.hasAttribute("disabled") || field.disabled) &&
        field.hasAttribute("required"));
}

function addOnChangeEvent(field, callback) {
    if (field.addEventListener) {
        field.addEventListener("change", e => callback(e, e.target), false);
    } else if (field.attachEvent) {
        field.attachEvent("onchange", e => callback(e, e, srcElement));
    }
}

function validate(input) {
    const inputType = input.getAttribute("type");
    const inputValue = input.value;

    if (requiresValidation(input)) {

        let invalid = false;

        switch (inputType) {
            case "email":
                invalid = !new RegExp(emailRegex)
                    .test(String(inputValue).toLocaleLowerCase())
                break;
            case "text":
                invalid = !new RegExp(nonEmptyTextRegex).test(String(inputValue).toLocaleLowerCase());
                break;
            case "radio":
                let i = 0;
                while (!invalid && i < input.length) {
                    if (input[i].checked) invalid = true;
                    i++;
                }
                break;
            default:
        }

        if (!invalid && input.getAttribute("aria-invalid")) {
            input.removeAttribute("aria-invalid");
        } else if (invalid && !input.getAttribute("aria-invalid")) {
            input.setAttribute("aria-invalid", "true");
        }
    }

}

Array.from(document.getElementsByTagName("input")).forEach(field => {
    addOnChangeEvent(field, (e, target) => {
        validate(target);
    });
});