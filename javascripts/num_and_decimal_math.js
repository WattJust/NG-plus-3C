function nP(a) {
	if (typeof(a)=="number") return a
	return new Decimal(a)
}

function nQ(a) {
	if (Decimal.lt(a, Number.MAX_VALUE)) return new Decimal(a).toNumber()
	return new Decimal(a)
}

function nN(a) {
	if (Decimal.lt(a, Number.MAX_VALUE)) return Math.floor(new Decimal(a).toNumber())
	return new Decimal(a)
}

function nA(a,b) {
	if (typeof(a)=="number"&&typeof(b)=="number") {
		let s=a+b
		if (s<1/0) return s
	}
	return nN(Decimal.add(a,b))
}

function nS(a,b) {
	if (typeof(a)=="number"&&typeof(b)=="number") return a-b
	return nN(Decimal.sub(a,b))
}

function nM(a,b) {
	if (typeof(a)=="number"&&typeof(b)=="number") {
		let m=a*b
		if (m<1/0) return Math.floor(m)
	}
	return nN(Decimal.times(a,b))
}

function nD(a,b) {
	if (typeof(a)=="number"&&typeof(b)=="number") return Math.floor(a/b)
	return nN(Decimal.div(a,b))
}

function nMx(a,b) {
	if (typeof(a)=="number"&&typeof(b)=="number") return Math.max(a,b)
	if (typeof(a)=="number") return b
	if (typeof(b)=="number") return a
	return a.max(b)
}

function nMn(a,b) {
	if (typeof(a)=="number"&&typeof(b)=="number") return Math.min(a,b)
	if (typeof(a)=="number") return a
	if (typeof(b)=="number") return b
	return a.min(b)
}

function nG(a,b) {
	if (typeof(a)=="number"&&typeof(b)=="number") return a>b
	if (typeof(a)=="number") return false
	if (typeof(b)=="number") return true
	return a.gt(b)
}

function nL(a,b) {
	if (typeof(a)=="number"&&typeof(b)=="number") return a<b
	if (typeof(a)=="number") return true
	if (typeof(b)=="number") return false
	return a.lt(b)
}

function nPow(a,b) {
	if (typeof(a)=="number"&&typeof(b)=="number") {
		let m=Math.pow(a,b)
		if (m<1/0) return Math.floor(m)
	}
	return nN(Decimal.pow(a,b))
}