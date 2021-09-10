function debounce(func, wait) {
	//防抖函数
	let timer = null;
	return (...args) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	};
}

export {
	debounce,
}
