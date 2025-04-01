let replicantiUnlock = function() { 
	if (player.aarexModifications.ngp3c) return 1e111
	return player.galacticSacrifice != undefined && player.tickspeedBoosts == undefined ? 1e80 : 1e140 
}

function unlockReplicantis() {
	if (player.infinityPoints.gte(replicantiUnlock())) {
		document.getElementById("replicantidiv").style.display = "inline-block"
		document.getElementById("replicantiunlock").style.display = "none"
		player.replicanti.unl = true
		player.replicanti.amount = new Decimal(1)
		player.infinityPoints = player.infinityPoints.minus(replicantiUnlock())
	}
}

function replicantiGalaxyBulkModeToggle() {
	player.galaxyMaxBulk = !player.galaxyMaxBulk
	document.getElementById('replicantibulkmodetoggle').textContent = "Mode: " + (player.galaxyMaxBulk ? "Max" : "Singles")
}

function getReplMult(next) {
	let exp = 2
	if (player.galacticSacrifice !== undefined) exp = Math.max(2, Math.pow(player.galaxies, .4))
	if (player.boughtDims) {
		exp += (player.timestudy.ers_studies[3] + (next ? 1 : 0)) / 2
		if (player.achievements.includes('r108')) exp *= 1.09;
	}
	if (player.aarexModifications.ngp3c) exp *= 2.5
	if ((tmp.cnd?tmp.cnd.repl:false) && player.aarexModifications.ngp3c) exp = Decimal.mul(exp, tmp.cnd.repl.eff2);
	let replmult = Decimal.max(player.replicanti.amount.log(2), 1).pow(exp)
	if (player.timestudy.studies.includes(21) && !player.aarexModifications.ngp3c) replmult = replmult.plus(Decimal.pow(player.replicanti.amount, 0.032))
	if (player.timestudy.studies.includes(102)) replmult = replmult.times(Decimal.pow(5, player.replicanti.galaxies))
	return replmult;
}

function upgradeReplicantiChance() {
	if (player.infinityPoints.gte(player.replicanti.chanceCost) && isChanceAffordable() && player.eterc8repl > 0) {
		if (ghostified) if (player.ghostify.milestones < 11) player.infinityPoints = player.infinityPoints.minus(player.replicanti.chanceCost)
		else player.infinityPoints = player.infinityPoints.minus(player.replicanti.chanceCost)
		player.replicanti.chance = Math.round(player.replicanti.chance * 100 + 1) / 100
		if (player.currentEternityChall == "eterc8") player.eterc8repl -= 1
		document.getElementById("eterc8repl").textContent = "You have " + player.eterc8repl + " purchases left."
		player.replicanti.chanceCost = player.replicanti.chanceCost.times(1e15)
	}
}

function isChanceAffordable() {
	return player.replicanti.chance < 1 || (tmp.ngp3 && player.masterystudies.includes("t265"))
}

function upgradeReplicantiInterval() {
	if (!(player.infinityPoints.gte(player.replicanti.intervalCost) && isIntervalAffordable() && player.eterc8repl !== 0)) return 
	player.infinityPoints = player.infinityPoints.minus(player.replicanti.intervalCost)
	player.replicanti.interval *= 0.9
	if (player.replicanti.interval < 1) {
		let x = 1 / player.replicanti.interval
		if (x > 1e10) x = Math.pow(x / 1e5, 2)
		player.replicanti.intervalCost = Decimal.pow("1e800", x)
	}
	else player.replicanti.intervalCost = player.replicanti.intervalCost.times(1e10)
	if (!isIntervalAffordable()) player.replicanti.interval = (player.timestudy.studies.includes(22) || player.boughtDims ? 1 : 50)
	if (player.currentEternityChall == "eterc8") player.eterc8repl -= 1
	document.getElementById("eterc8repl").textContent = "You have " + player.eterc8repl + " purchases left."
}

function getReplicantiCap() {
	if (player.aarexModifications.ngp3c) {
		let lim = getReplicantiLimit();
		if (player.timestudy.studies.includes(52)) lim = Decimal.pow(lim, ts52Eff())
		if (player.timestudy.studies.includes(192)) lim = Decimal.mul(lim, player.timeShards.plus(1))
		if (player.dilation.upgrades.includes("ngp3c4")) lim = Decimal.mul(lim, player.dilation.dilatedTime.plus(1).pow(2500))
		if (player.dilation.upgrades.includes("ngp3c9")) lim = Decimal.mul(lim, getDil56Mult())
		lim = Decimal.mul(lim, getECReward(13, true));
		if (tmp.ngp3c && player.masterystudies.includes("t390")) lim = Decimal.mul(lim, getMTSMult(390));
		return lim;
	}
	return getReplicantiLimit();
}

function getReplicantiLimit() {
	if (player.boughtDims) return player.replicanti.limit
	return Number.MAX_VALUE
}

function isIntervalAffordable() {
	if (tmp.ngp3) if (player.masterystudies.includes("t271")) return true
	return player.replicanti.interval > (player.timestudy.studies.includes(22) || player.boughtDims ? 1 : 50)
}

function getDistantRGStart() {
	let start = 3e3
	if (hasBosonicUpg(43) && tmp.ngp3c) start += tmp.blu[43]
	return start;
}

function getRGCost(offset = 0, costChange) {
	let ret = player.replicanti.galCost
	if (offset > 0) {
		if (inQC(5)) return player.replicanti.galCost.pow(Math.pow(1.2, offset))
		else {
			let increase = 0
			if (player.currentEternityChall == "eterc6") increase = offset * ((offset + player.replicanti.gal * 2) + 3)
			else increase = offset * (2.5 * (offset + player.replicanti.gal * 2) + 22.5)
			if (player.replicanti.gal + offset > 99) increase += (offset - Math.max(99 - player.replicanti.gal, 0)) * (25 * (offset - Math.max(99 - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, 99) * 2) - 4725)
			
			let scaleStart = player.aarexModifications.ngp3c?250:400
			if (player.replicanti.gal + offset > (scaleStart-1)) {
				if (player.exdilation != undefined) for (var g = Math.max(player.replicanti.gal, scaleStart-1); g < player.replicanti.gal + offset; g++) increase += Math.pow(g - scaleStart-11, 2)
				if (player.meta != undefined || player.aarexModifications.ngp3c) {
					var isReduced = false
					if (player.masterystudies != undefined) if (player.masterystudies.includes("t266") && player.currentEternityChall != "eterc6") isReduced = true
					if (isReduced) {
						increase += (offset - Math.max(scaleStart-1 - player.replicanti.gal, 0)) * (1500 * (offset - Math.max(scaleStart-1 - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, scaleStart-1) * 2) - 1183500)

						let distantStart = getDistantRGStart()
						if (player.replicanti.gal + offset > distantStart-2) increase += (offset - Math.max((distantStart-2) - player.replicanti.gal, 0)) * (15e6/distantStart * (offset - Math.max((distantStart-2) - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, distantStart-2) * 2) - 29935e3)
						if (player.replicanti.gal + offset > 58198) increase += (offset - Math.max(58199 - player.replicanti.gal, 0)) * (1e6 * (offset - Math.max(58199 - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, 58199) * 2) - 58199e6)
						if (player.replicanti.gal + offset >= 200000) {
							increase += 1e12 * (offset - Math.max(199999 - player.replicanti.gal, 0))
							increase += (offset - Math.max(199999 - player.replicanti.gal, 0)) * (1e9 * (offset - Math.max(199999 - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, 199999) * 2) - 199999e9)
						}
						if (player.replicanti.gal + offset >= 250000) increase += 1e12 * (offset - Math.max(249999 - player.replicanti.gal, 0))
						if (player.replicanti.gal + offset >= 300000) increase += 1e13 * (offset - Math.max(299999 - player.replicanti.gal, 0))
						if (player.replicanti.gal + offset >= 350000) increase += 1e14 * (offset - Math.max(349999 - player.replicanti.gal, 0))
					} else for (var g = Math.max(player.replicanti.gal, scaleStart-1); g < player.replicanti.gal + offset; g++) increase += 5 * Math.floor(Math.pow(1.2, g - (scaleStart-6)))
				}
			}
			ret = ret.times(Decimal.pow(10, increase))
		}
	}
	if (player.timestudy.studies.includes(233) && !costChange) ret = ret.dividedBy(player.replicanti.amount.pow(0.3))
	return ret
}

function upgradeReplicantiGalaxy() {
	var cost = getRGCost()
	if (player.infinityPoints.gte(cost) && player.eterc8repl !== 0) {
		player.infinityPoints = player.infinityPoints.minus(cost)
		player.replicanti.galCost = getRGCost(1, true)
		player.replicanti.gal += 1
		if (player.currentEternityChall == "eterc8") player.eterc8repl -= 1
		document.getElementById("eterc8repl").textContent = "You have "+player.eterc8repl+" purchases left."
		return true
	}
	return false
}

var extraReplGalaxies = 0
function replicantiGalaxy() {
	var maxGal = getMaxRG()
	if (!canGetReplicatedGalaxy()) return
	if (player.galaxyMaxBulk) player.replicanti.galaxies=maxGal
	else player.replicanti.galaxies++
	if (tmp.ngp3l||!player.achievements.includes("ng3p67")) player.replicanti.amount=Decimal.div(player.achievements.includes("r126")?player.replicanti.amount:1,Number.MAX_VALUE).max(1)
	galaxyReset(0)
}

function canGetReplicatedGalaxy() {
	return player.replicanti.galaxies < getMaxRG() && player.replicanti.amount.gte(getReplicantiLimit())
}

function canAutoReplicatedGalaxy() {
	return speedrunMilestonesReached >= 20 || !player.timestudy.studies.includes(131) || player.aarexModifications.ngp3c
}

function getMaxRG() {
	let ret = player.replicanti.gal
	if (player.timestudy.studies.includes(131)) ret += Math.floor(ret * 0.5)
	return ret
}

function autoBuyRG() {
	if (!player.infinityPoints.gte(getRGCost())) return
	let increment = 1
	while (player.infinityPoints.gte(getRGCost(increment - 1))) increment *= 2
	let toBuy = 0
	while (increment >= 1) {
		if (player.infinityPoints.gte(getRGCost(toBuy + increment - 1))) toBuy += increment
		increment /= 2
	}
	let newIP = player.infinityPoints
	let cost = getRGCost(toBuy - 1)
	let toBuy2 = toBuy
	while (toBuy > 0 && newIP.div(cost).lt(1e16)) {
		if (newIP.gte(cost)) newIP = newIP.sub(cost)
		else {
			newIP = player.infinityPoints.sub(cost)
			toBuy2--
		}
		toBuy--
		cost = getRGCost(toBuy - 1)
	}
	player.replicanti.infinityPoints = newIP
	player.replicanti.galCost = getRGCost(toBuy2, true)
	player.replicanti.gal += toBuy2
}

function updateExtraReplGalaxies() {
	let ts225Eff = 0
	let ts226Eff = 0
	let speed = tmp.ngp3c?1:(tmp.qcRewards[8] * 2)
	if (player.timestudy.studies.includes(225)) {
		ts225Eff = Math.floor(player.replicanti.amount.e / 1e3)
		if (ts225Eff > 99) ts225Eff = Math.floor(Math.sqrt(0.25 + (ts225Eff - 99) * speed) + 98.5)
		if (ts225Eff > 2.5e5) ts225Eff = Math.log10(ts225Eff)*46314
	}
	if (player.timestudy.studies.includes(226)) {
		ts226Eff = Math.floor(player.replicanti.gal / 15)
		if (ts226Eff > 99) ts226Eff = Math.floor(Math.sqrt(0.25 + (ts226Eff - 99) * speed) + 98.5)
	}
	extraReplGalaxies = ts225Eff + ts226Eff
	if (extraReplGalaxies > 325) extraReplGalaxies = (Math.sqrt(0.9216+0.16*(extraReplGalaxies-324))-0.96)/0.08+324
	if (tmp.ngp3) {
		let expData={
			normal: 1/3,
			ts362: 0.4,
			legacy: 0.25,
			ts362legacy: 0.35
		}
		let expVarName=(player.masterystudies.includes("t362")?"ts362":"")+(tmp.ngp3l?"legacy":"")
		if (expVarName=="") expVarName="normal"
		let exp=expData[expVarName]
		if (!tmp.ngp3l&&player.masterystudies.includes("t412")) exp=.5

		tmp.pe=Math.pow(tmp.qu.replicants.quarks.add(1).log10(),exp)
		tmp.pe*=tmp.ngp3l?0.67*(player.masterystudies.includes("t412")?1.25:1):0.8
		if (player.ghostify.ghostlyPhotons.unl) tmp.pe*=tmp.le[3]
		if (tmp.ngp3c) if (player.ghostify.hb.unl && tmp.hm.preons && player.ghostify.hb.masses.preons) tmp.pe *= tmp.hm.preons.eff
		extraReplGalaxies*=colorBoosts.g+tmp.pe
	}
	extraReplGalaxies = Math.floor(extraReplGalaxies)
}

function getTotalRG() {
	return player.replicanti.galaxies + extraReplGalaxies
}

function replicantiGalaxyAutoToggle() {
	player.replicanti.galaxybuyer=!player.replicanti.galaxybuyer
	document.getElementById("replicantiresettoggle").textContent="Auto galaxy "+(player.replicanti.galaxybuyer?"ON":"OFF")+(!canAutoReplicatedGalaxy()?" (disabled)":"")
}

function getReplSpeed() {
	let inc = .2
	let exp = Math.floor(Decimal.log10(getReplScaleStart()))
	if (player.dilation.upgrades.includes('ngpp1') && (!player.aarexModifications.nguspV || player.aarexModifications.nguepV)) {
		let expDiv = 10
		if (tmp.ngp3 && !tmp.ngp3l) expDiv = 9
		let x = 1 + player.dilation.dilatedTime.max(1).log10() / expDiv
		inc /= Math.min(x, 200)
		if (x > 200) exp += x / 10 - 20
	}
	if (player.dilation.upgrades.includes("ngmm10")) exp += player.dilation.upgrades.length*2
	inc = inc + 1
	if (GUBought("gb2")) exp *= 2
	if (hasNU(12) && tmp.qu.bigRip.active && tmp.ngp3c) exp *= tmp.nu[4].time;
	if (hasNU(13) && tmp.ngp3c) exp *= 1.25;
	if (hasNU(16) && player.ghostify.hb.unl && tmp.ngp3c) exp *= tmp.nu[7];
	if (hasBosonicUpg(35) && !tmp.ngp3c) exp += tmp.blu[35].rep
	if (hasBosonicUpg(44) && !tmp.ngp3c) exp += tmp.blu[44]
	
	return {inc: inc, exp: exp}
}

function getReplicantiInterval() {
	let interval = player.replicanti.interval
	if (player.aarexModifications.ngexV) interval *= .8
	if (player.timestudy.studies.includes(62)) interval /= tsMults[62]()
	if (player.replicanti.amount.gt(Number.MAX_VALUE)||player.timestudy.studies.includes(133)) interval *= 10
	if (player.timestudy.studies.includes(213)) interval /= tsMults[213]()
	if (GUBought("gb1")) interval /= getGB1Effect()
	if (player.replicanti.amount.lt(Number.MAX_VALUE) && player.achievements.includes("r134")) interval /= 2
	if (isBigRipUpgradeActive(4)) interval /= 10

	interval = new Decimal(interval)
	if (player.exdilation != undefined) interval = interval.div(getBlackholePowerEffect().pow(1/3))
	if (player.dilation.upgrades.includes('ngpp1') && player.aarexModifications.nguspV && !player.aarexModifications.nguepV) interval = interval.div(player.dilation.dilatedTime.max(1).pow(0.05))
	if (player.dilation.upgrades.includes("ngmm9")) interval = interval.div(getDil72Mult())
	if (tmp.ngp3 && !tmp.ngp3c) if (player.masterystudies.includes("t332")) interval = interval.div(getMTSMult(332))
	if (tmp.cnd && player.aarexModifications.ngp3c) interval = interval.div(tmp.cnd.repl.eff1)
	return interval
}

function getReplScaleStart() {
	return Number.MAX_VALUE
}

function getReplicantiFinalInterval() {
	let x = getReplicantiInterval()
	if (player.replicanti.amount.gt(getReplScaleStart())) x = player.boughtDims ? Math.pow(player.achievements.includes("r107") ? Math.max(player.replicanti.amount.log(2)/1024,1) : 1, -.25) * x.toNumber() : Decimal.pow(tmp.rep.speeds.inc, Math.max(player.replicanti.amount.log10() - tmp.rep.speeds.exp, 0)/tmp.rep.speeds.exp).times(x)
	if (player.aarexModifications.ngp3c) x = Decimal.div(x, 20)
	return x
}

function runRandomReplicanti(chance){
	if (Decimal.gte(chance, 1)) {
		player.replicanti.amount = player.replicanti.amount.times(2)
		return
	}
	var temp = player.replicanti.amount
	if (typeof(chance) == "object") chance = chance.toNumber()
	for (var i = 0; temp.gt(i); i++) {
		if (chance > Math.random()) player.replicanti.amount = player.replicanti.amount.plus(1)
		if (i >= 99) return
	}
}

function notContinuousReplicantiUpdating() {
	var chance = tmp.rep.chance
	var interval = Decimal.div(tmp.rep.interval, 100)
	if (typeof(chance) !== "number") chance = chance.toNumber()

	if (interval <= replicantiTicks && player.replicanti.unl) {
		if (player.replicanti.amount.lte(100)) runRandomReplicanti(chance) //chance should be a decimal
		else if (player.replicanti.amount.lt(getReplicantiCap())) {
			var temp = Decimal.round(player.replicanti.amount.dividedBy(100))
			if (chance < 1) {
				let counter = 0
				for (var i=0; i<100; i++) if (chance > Math.random()) counter++;
				player.replicanti.amount = temp.times(counter).plus(player.replicanti.amount)
				counter = 0
			} else player.replicanti.amount = player.replicanti.amount.times(2)
			if (!player.timestudy.studies.includes(192)||player.aarexModifications.ngp3c) {
				if (!(((hasNU(12) && tmp.qu.bigRip.active)||(hasNU(13) && !tmp.qu.bigRip.active)) && tmp.ngp3c)) player.replicanti.amount = player.replicanti.amount.min(getReplicantiCap())
			}
		}
		replicantiTicks -= interval
	}
}

function continuousReplicantiUpdating(diff){
	let pastLimit = player.timestudy.studies.includes(192) && !player.aarexModifications.ngp3c
	if (((hasNU(12) && tmp.qu.bigRip.active)||(hasNU(13) && !tmp.qu.bigRip.active)) && tmp.ngp3c) pastLimit = true;
	if ((player.timestudy.studies.includes(192)||Decimal.gte(getReplicantiCap(), getReplicantiLimit())) && tmp.rep.est.toNumber() > 0 && tmp.rep.est.toNumber() < 1/0) player.replicanti.amount = Decimal.pow(Math.E, tmp.rep.ln +Math.log((diff*tmp.rep.est/10) * (Math.log10(tmp.rep.speeds.inc)/tmp.rep.speeds.exp)+1) / (Math.log10(tmp.rep.speeds.inc)/tmp.rep.speeds.exp)).min(pastLimit?1/0:getReplicantiCap())
	else if (player.timestudy.studies.includes(192)||Decimal.gte(getReplicantiCap(), getReplicantiLimit())) player.replicanti.amount = Decimal.pow(Math.E, tmp.rep.ln + tmp.rep.est.times(diff * Math.log10(tmp.rep.speeds.inc) / tmp.rep.speeds.exp / 10).add(1).log(Math.E) / (Math.log10(tmp.rep.speeds.inc)/tmp.rep.speeds.exp)).min(pastLimit?1/0:getReplicantiCap())
	else player.replicanti.amount = Decimal.pow(Math.E, tmp.rep.ln +(diff*tmp.rep.est/10)).min(getReplicantiCap())
	replicantiTicks = 0
}

function toggleReplAuto(i) {
	if (i == "chance") {
		if (player.replicanti.auto[0]) {
			player.replicanti.auto[0] = false
			document.getElementById("replauto1").textContent = "Auto: OFF"
		} else {
			player.replicanti.auto[0] = true
			document.getElementById("replauto1").textContent = "Auto: ON"
		}
	} else if (i == "interval") {
		if (player.replicanti.auto[1]) {
			player.replicanti.auto[1] = false
			document.getElementById("replauto2").textContent = "Auto: OFF"
		} else {
			player.replicanti.auto[1] = true
			document.getElementById("replauto2").textContent = "Auto: ON"
		}
	} else if (i == "galaxy") {
		if (player.replicanti.auto[2]) {
			player.replicanti.auto[2] = false
			document.getElementById("replauto3").textContent = "Auto: OFF"
		} else {
			player.replicanti.auto[2] = true
			document.getElementById("replauto3").textContent = "Auto: ON"
		}
	}
}