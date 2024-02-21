// Check box function
export const handleCheck = (checked, setChecked, setCheckedAll, id, data) => {
    setChecked((prev) => {
        const isChecked = checked?.includes(id);
        if (isChecked) {
            setCheckedAll(false);
            return checked?.filter((item) => item !== id);
        } else {
            const newChecked = [...prev, id];
            if (newChecked.length === data?.length) {
                setCheckedAll(true);
            }
            return newChecked;
        }
    });
};

// Check box all function
export const handleCheckAll = (checkedAll, checkedLength, data, setChecked) => {
    if (checkedAll === false) {
        if (checkedLength === data?.length) {
            return setChecked([]);
        } else {
            return setChecked((checked) => checked);
        }
    } else {
        const idsArray = data?.map((item) => item._id) || [];
        return setChecked(idsArray);
    }
};
