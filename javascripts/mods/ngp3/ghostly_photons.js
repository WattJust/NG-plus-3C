function updateLightEmpowermentReq() {
	tmp.leReq = getLightEmpowermentReq()
}

function getLightEmpowermentBoost() {
	let r = player.ghostify.ghostlyPhotons.enpowerments
	if (hasBosonicUpg(13)) r *= tmp.blu[13]
	if (isLEBoostUnlocked(11) && tmp.ngp3c) r *= tmp.leBonus[11]||1
	return r
}

var leBoosts = {
	reqs: [null, 1, 2, 3, 10, 13, 16, 19, 22, 25, 1/0, 1/0],
	condReqs: [null, 1, 2, 3, 5, 6, 7, 8, 9, 10, 20, 25],
	max: 11,
	effects: [
		null,
		//Boost #1
		function() {
			var le1exp = 0.75
			if (tmp.ngp3l) le1exp = 1
			else if (tmp.newNGP3E) {
				le1exp += 0.2
				if (player.ghostify.ghostlyPhotons.unl) le1exp += .15
				if (player.ghostify.wzb.unl) le1exp += .15
			}
			var le1mult = 500
			if (tmp.ngp3l) le1mult = 300
			if (tmp.newNGP3E) le1mult *= 2
			var eff = Math.pow(Math.log10(tmp.effL[3] + 1), le1exp) * le1mult
			return eff
		},
		//Boost #2
		function() {
			return Math.log10(tmp.effL[4] * 10 + 1) / 4 + 1
		},
		//Boost #3
		function() {
			return Math.pow(tmp.effL[0].normal + 1, 0.1) * (tmp.ngp3c?3:2) - 1
		},
		//Boost #4
		function() {
			return tmp.leBonus[4]
		},
		//Boost #5
		function() {
			return {
				exp: 0.75 - 0.25 / Math.sqrt(tmp.leBoost / 200 + 1),
				mult: Math.pow(tmp.leBoost / 100 + 1, 1/3),
			}
		},
		//Boost #6
		function() {
			return Math.pow(3, Math.pow(tmp.effL[2] + 1, 0.25) - 1)
		},
		//Boost #7
		function() {
			return Math.pow(tmp.effL[5] / 150 + 1, 0.25)
		},
		//Boost #8
		function() {
			return Math.pow(tmp.effL[6] / 500 + 1, 0.125)
		},
		//Boost #9
		function() {
			let l1 = tmp.effL[1]
			if (l1>=1e5) l1 = Math.pow(1e5, Math.sqrt(Math.log(l1)/Math.log(1e5)))
			return Math.pow(l1 / 10 + 1, 1/3) - 1
		},
		//Boost #10 (NG+3C exclusive)
		function() {
			let x = tmp.leBoost / 100;
			if (x>=1) x = Math.sqrt(x)
			if (x>=2) x = Math.log2(x) + 1
			return x + 1
		},
		// Boost #11 (NG+3C exclusive)
		function() {
			return Math.log10(tmp.effL[7] / 40 + 1)/3 + 1
		},
	]
}

function isLEBoostUnlocked(x) {
	if (!tmp.ngp3) return false
	if (!ghostified) return false
	if (!player.ghostify.ghostlyPhotons.unl) return false
	if (x >= 4 && !hasBosonicUpg(32)) return false
	if (x >= 10 && !(hasBosonicUpg(52) && tmp.ngp3c)) return false
	return player.ghostify.ghostlyPhotons.enpowerments >= (tmp.ngp3c?leBoosts.condReqs[x]:leBoosts.reqs[x])
}

function updateGPHUnlocks() {
	let unl = player.ghostify.ghostlyPhotons.unl
	document.getElementById("gphUnl").style.display = unl ? "none" : ""
	document.getElementById("gphDiv").style.display = unl ? "" : "none"
	document.getElementById("gphRow").style.display = unl ? "" : "none"
	document.getElementById("breakUpgR3").style.display = unl ? "" : "none"
	document.getElementById("bltabbtn").style.display = unl ? "" : "none"
}

function getGPHProduction() {
	let b = tmp.qu.bigRip.active
	if (b) var ret = player.dilation.dilatedTime.div(tmp.ngp3c?"1e2460":"1e480")
	else var ret = player.dilation.dilatedTime.div(tmp.ngp3c?"1e1780":"1e930")
	if (ret.gt(1)) ret = ret.pow(tmp.ngp3c?0.004:0.02)
	if (b && ret.gt(Decimal.pow(2, tmp.ngp3c?50:444))) ret = ret.div(Decimal.pow(2, tmp.ngp3c?50:444)).sqrt().times(Decimal.pow(2, tmp.ngp3c?50:444))
	if (!b && hasNU(14) && tmp.ngp3c) ret = ret.times(tmp.nu[5]);
	return ret
}

function updatePhotonsTab(){
	updateRaysPhotonsDisplay()
	updateLightThresholdStrengthDisplay()
	updateLightBoostDisplay()
	updateLEmpowermentPrimary()
	updateLEmpowermentBoosts()
}

function updateRaysPhotonsDisplay(){
	var gphData = player.ghostify.ghostlyPhotons
	document.getElementById("dtGPH").textContent = shorten(player.dilation.dilatedTime)
	document.getElementById("gphProduction").textContent = shorten(getGPHProduction())
	document.getElementById("gphProduction").className = (tmp.qu.bigRip.active ? "gph" : "dm") + "Amount"
	document.getElementById("gphProductionType").textContent = tmp.qu.bigRip.active ? "Ghostly Photons" : "Dark Matter"
	document.getElementById("gph").textContent = shortenMoney(gphData.amount)
	document.getElementById("dm").textContent = shortenMoney(gphData.darkMatter)
	document.getElementById("ghrProduction").textContent = shortenMoney(getGHRProduction())
	document.getElementById("ghrCap").textContent = shortenMoney(getGHRCap())
	document.getElementById("ghr").textContent = shortenMoney(gphData.ghostlyRays)
	for (let i=1;i<=8;i++) updateLightCondenser(i);
}

function updateLightBoostDisplay(){
	var gphData = player.ghostify.ghostlyPhotons
	document.getElementById("lightMax1").textContent = getFullExpansion(gphData.maxRed)
	document.getElementById("lightBoost1").textContent = tmp.le[0].toFixed(3)
	document.getElementById("lightBoost2").textContent = tmp.le[1].toFixed(2)
	document.getElementById("lightBoost3").textContent = getFullExpansion(Math.floor(tmp.le[2]))
	document.getElementById("lightBoost4").textContent = (tmp.le[3] * 100 - 100).toFixed(1)
	document.getElementById("lightBoost5").textContent = (tmp.le[4] * 100).toFixed(1) + ((hasBosonicUpg(11)&&!tmp.ngp3c) ? "+" + (tmp.blu[11] * 100).toFixed(1) : "")
	document.getElementById("lightBoost6").textContent = shorten(tmp.le[5])
	document.getElementById("lightBoost7").textContent = shorten(tmp.le[6])
}

function updateLightThresholdStrengthDisplay(){
	var gphData=player.ghostify.ghostlyPhotons
	for (var c = 0; c < 8; c++) {
		let extra = getExtraLight(c)
		document.getElementById("light" + (c + 1)).textContent = getFullExpansion(gphData.lights[c])+((extra>0)?("+"+getFullExpansion(extra)):"")
		document.getElementById("lightThreshold" + (c + 1)).textContent = shorten(getLightThreshold(c))
		if (c > 0) document.getElementById("lightStrength" + c).textContent = shorten(tmp.ls[c-1])
	}
}

function updateLEmpowermentPrimary(){
	var gphData = player.ghostify.ghostlyPhotons
	document.getElementById("lightEmpowerment").className = "gluonupgrade "+(gphData.lights[7] >= tmp.leReq ? "gph" : "unavailablebtn")
	document.getElementById("lightEmpowermentReq").textContent = getFullExpansion(tmp.leReq)
	document.getElementById("lightEmpowerments").textContent = getFullExpansion(gphData.enpowerments)
	document.getElementById("lightEmpowermentScaling").textContent = getGalaxyScaleName(tmp.leReqScale) + "Light Empowerments"
	document.getElementById("lightEmpowermentsEffect").textContent = shorten(tmp.leBoost)
}

function updateLEmpowermentBoosts(){
	var boosts = 0
	for (var e = 1; e <= leBoosts.max; e++) {
		var unlocked = isLEBoostUnlocked(e)
		if (unlocked) boosts++
		document.getElementById("le"+e).style.visibility = unlocked ? "visible" : "hidden"
	}
	if (boosts >= 1) {
		document.getElementById("leBoost1").textContent = getFullExpansion(Math.floor(tmp.leBonus[1].effect))
		document.getElementById("leBoost1Total").textContent = getFullExpansion(Math.floor(tmp.leBonus[1].total))
	}
	if (boosts >= 2) document.getElementById("leBoost2").textContent = (tmp.leBonus[2] * 100 - 100).toFixed(1)
	if (boosts >= 3) document.getElementById("leBoost3").textContent = tmp.leBonus[3].toFixed(2)
	if (boosts >= 5) document.getElementById("leBoost5").textContent = "(" + shorten(tmp.leBonus[5].mult) + "x+1)^" + tmp.leBonus[5].exp.toFixed(3)
	if (boosts >= 6) document.getElementById("leBoost6").textContent = shorten(tmp.leBonus[6])
	if (boosts >= 7) document.getElementById("leBoost7").textContent = getFullExpansion(Math.round(tmp.leBonus[7] * 1e3)/10)
	if (boosts >= 8) document.getElementById("leBoost8").textContent = (tmp.leBonus[8] * 100).toFixed(1)
	if (boosts >= 9) document.getElementById("leBoost9").textContent = tmp.leBonus[9].toFixed(2)
	if (boosts >= 10) document.getElementById("leBoost10").textContent = ((tmp.leBonus[10]-1) * 100).toFixed(1)
	if (boosts >= 11) document.getElementById("leBoost11").textContent = ((tmp.leBonus[11]-1) * 100).toFixed(1)
}

function getGHRProduction() {
	var log = player.ghostify.ghostlyPhotons.amount.sqrt().times(tmp.ngp3c?10:.5).log10()
	if (player.ghostify.neutrinos.boosts >= 11) log += tmp.nb[11].log10()
	if (tmp.ngp3c) for (let i=1;i<=8;i++) log += Math.log10(getLightCondenserEff(i));
	if (tmp.ngp3c) if (player.ghostify.hb.unl && tmp.hm.gph && player.ghostify.hb.masses.gph) log += tmp.hm.gph.eff.log10()
	return Decimal.pow(10, log)
}

function getGHRCap() {
	var log = player.ghostify.ghostlyPhotons.darkMatter.pow(0.4).times(1e3).log10()
	if (player.ghostify.neutrinos.boosts >= 11 && !tmp.ngp3c) log += tmp.nb[11].log10()
	if (tmp.ngp3c) for (let i=1;i<=8;i++) log += Math.log10(getLightCondenserEff(i));
	if (hasBosonicUpg(13) && tmp.ngp3c) log += Math.log10(Math.max(tmp.blu[13], 1));
	if (tmp.ngp3c) if (player.ghostify.hb.unl && tmp.hm.dm && player.ghostify.hb.masses.dm) log += tmp.hm.dm.eff.log10()
	return Decimal.pow(10, log)
}

function getLightThreshold(l) {
	return Decimal.pow(getLightThresholdIncrease(l), player.ghostify.ghostlyPhotons.lights[l]).times(tmp.lt[l]).div(getLightThresholdDiv())
}

function getLightThresholdDiv() {
	return tmp.ngp3c ? 4 : 1;
}

function getLightThresholdIncrease(l) {
	let x = tmp.lti[l]
	if (isNanoEffectUsed("light_threshold_speed")) {
		let y = 1 / tmp.nf.effects.light_threshold_speed
		if (y < 1) x = Math.pow(x, y)
	}
	if (hasBosonicUpg(42) && tmp.ngp3c && l==7) x = Math.pow(x, .96);
	return x
}

function getExtraLight(l) {
	let extra = 0;
	if (hasBosonicUpg(42) && tmp.ngp3c) {
		if (l==0) extra += tmp.blu[42].r;
		else if (l==3) extra += tmp.blu[42].g;
		else if (l==4) extra += tmp.blu[42].b;
	}
	return extra;
}

function globalLightPower() {
	return tmp.ngp3c ? 1/3 : 1;
}

function lightEmpowerment() {
	if (!(player.ghostify.ghostlyPhotons.lights[7] >= tmp.leReq)) return
	if (!player.aarexModifications.leNoConf && !confirm("You will become a ghost, but Ghostly Photons will be reset. You will gain 1 Light Empowerment from this. Are you sure you want to proceed?")) return
	if (!player.ghostify.ghostlyPhotons.enpowerments) document.getElementById("leConfirmBtn").style.display = "inline-block"
	player.ghostify.ghostlyPhotons.enpowerments++
	if (hasAch("ng3pc16")) return;
	ghostify(false, true)
	if (player.achievements.includes("ng3p91")) return
	player.ghostify.ghostlyPhotons.amount = new Decimal(0)
	player.ghostify.ghostlyPhotons.darkMatter = new Decimal(0)
	player.ghostify.ghostlyPhotons.ghostlyRays = new Decimal(0)
	player.ghostify.ghostlyPhotons.lights = [0,0,0,0,0,0,0,0]
	if (tmp.ngp3c) player.condensed.light = [null, 0, 0, 0, 0, 0, 0, 0, 0];
}

var LE_scale_start = {
	1() { 
		let start = 20;
		if (hasBosonicUpg(55) && tmp.ngp3c) start += 5;
		return start; 
	},
	2() { return 50 },
}

function loadLEReqScaleStarts() {
	let obj = {}
	for (let i=1;i<=Object.keys(LE_scale_start).length;i++) obj[i] = LE_scale_start[i]()
	return obj;
}

function getLightEmpowermentReq(le) {
	if (le === undefined) le = player.ghostify.ghostlyPhotons.enpowerments
	let mult = tmp.ngp3c ? 3.6 : 2.4;
	let x = le * mult + (tmp.ngp3c?3:1)
	let scale = 0
	tmp.leReqScaleStarts = loadLEReqScaleStarts();
	if (!tmp.ngp3l) {
		if (le >= tmp.leReqScaleStarts[1]) {
			x += Math.pow(le - tmp.leReqScaleStarts[1] + 1, 2) / 3
			scale = 1
		}
		if (le >= tmp.leReqScaleStarts[2]) {
			// In NG+3C, it's the same as Distant but 5x stronger
			if (tmp.ngp3c) x += Math.pow(le - tmp.leReqScaleStarts[2] + 1, 2) * 5/3
			else x += Math.pow(1.2, le - tmp.leReqScaleStarts[2] + 1) - 1
			scale = 2
		}
	}
	if (player.achievements.includes("ng3p95")) x--
	if (hasBosonicUpg(64) && tmp.ngp3c) {
		x -= tmp.blu[64].sub
		x /= tmp.blu[64].div
	}
	tmp.leReqScale = scale
	return Math.floor(x)
}