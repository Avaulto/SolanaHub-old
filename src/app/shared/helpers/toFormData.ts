export function toFormData<T>(formValue: T) {
  const formData = new FormData();
  for (const key of Object.keys(formValue)) {
    let value = formValue[key];
    // if (key == "image") {
    //     value = new Blob([value], { type: "image/png" });
    //     formData.append(key, value, "image");
    // } else {
    // }
    if (key == "certificate") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  }

  return formData;
}
