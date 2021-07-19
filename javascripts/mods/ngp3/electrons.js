function updateElectronsTab() {
	let trueSacGals = !hasAch("ng3pc24")
	document.getElementById("sacGalDiv").style.display = trueSacGals?"":"none"
	if (trueSacGals) document.getElementById("normalGalaxies").textContent = getFullExpansion(player.galaxies)
	document.getElementById("sacrificeGal").className = "gluonupgrade " + ((player.galaxies > tmp.qu.electrons.sacGals && inQC(0)) ? "stor" : "unavailabl") + "ebtn"
	document.getElementById("sacrificeGals").textContent = getFullExpansion(Math.max(player.galaxies-tmp.qu.electrons.sacGals, 0))
	document.getElementById("electronsGain").textContent = getFullExpansion(Math.floor(Math.max(player.galaxies-tmp.qu.electrons.sacGals, 0) * getElectronGainFinalMult()))
	for (var u = 1; u < 5; u++) document.getElementById("electronupg" + u).className = "gluonupgrade " + (canBuyElectronUpg(u) ? "stor" : "unavailabl") + "ebtn"
	if (tmp.qu.autoOptions.sacrifice || tmp.ngp3c) updateElectronsEffect()
	document.getElementById("elecNGP3C").style.display = player.aarexModifications.ngp3c?"":"none"
	if (player.aarexModifications.ngp3c) updateElecCond()
}

function updateElectrons(retroactive, updateMult) {
	if (!tmp.ngp3 || !player.masterystudies.includes("d7")) {
		document.getElementById("electronstabbtn").style.display = "none"
		return
	} else document.getElementById("electronstabbtn").style.display = ""
	var mult = getElectronGainFinalMult()
	document.getElementById("electronsGainMult").textContent = mult.toFixed(2)
	if (retroactive) {
		if (updateMult) {
			tmp.qu.electrons.mult = 6;
			for (let i=1;i<=4;i++) tmp.qu.electrons.mult += getElectronUpgIncrease(i) * tmp.qu.electrons.rebuyables[i - 1]
		}
		tmp.qu.electrons.amount = getElectronGainFinalMult() * tmp.qu.electrons.sacGals
	}
	if (!tmp.qu.autoOptions.sacrifice && !tmp.ngp3c) updateElectronsEffect()
	for (var u = 1; u < 5; u++) {
		var cost = getElectronUpgCost(u)
		document.getElementById("electronupg" + u).innerHTML = "Increase the multiplier by " + (getElectronGainMult() * getElectronUpgIncrease(u)).toFixed(2) + "x.<br>" +
			"Level: " + getFullExpansion(tmp.qu.electrons.rebuyables[u-1]) + "<br>" +
			"Cost: " + ((u == 4 ? getFullExpansion : shortenCosts)(cost)) + " " + [null, "Time Theorems", "dilated time", "meta-antimatter", "Meta-Dimension Boosts"][u]
	}
}

function updateElectronsEffect() {
	if (!tmp.qu.autoOptions.sacrifice && !tmp.ngp3c) {
		tmp.mpte = getElectronBoost()
		document.getElementById("electronsAmount2").textContent = "You have " + getFullExpansion(Math.round(tmp.qu.electrons.amount)) + " electrons."
	}
	document.getElementById("sacrificedGals").textContent = getFullExpansion(tmp.qu.electrons.sacGals)+(tmp.ngp3c?((tmp.cnd.pe>0)?(" - "+getFullExpansion(tmp.cnd.pe)):""):"")
	document.getElementById("electronsAmount").textContent = getFullExpansion(Math.round(tmp.qu.electrons.amount))
	document.getElementById("electronsTranslation").textContent = getFullExpansion(Math.round(tmp.mpte))
	document.getElementById("electronsEffect").textContent = shorten(getDimensionPowerMultiplier("non-random"))
	document.getElementById("linearPerTenMult").textContent = shorten(getDimensionPowerMultiplier("linear"))
}

function sacrificeGalaxy(auto = false) {
	if (!player.masterystudies.includes("d7")) return;
	var amount = player.galaxies - tmp.qu.electrons.sacGals
	if (amount < 1) return
	if (player.options.sacrificeConfirmation && !auto) if (!confirm("You will perform a Galaxy reset, but you will exchange all your galaxies to electrons, which will give a boost to your Multiplier per Ten Dimensions.")) return
	tmp.qu.electrons.sacGals = player.galaxies
	tmp.qu.electrons.amount += getElectronGainFinalMult() * amount
	if (!tmp.qu.autoOptions.sacrifice && !tmp.ngp3c) updateElectronsEffect()
	if (!auto) galaxyReset(0)
}

function getElectronBoost(mod) {
	if (!inQC(0)) return 1
	var amount = tmp.qu.electrons.amount
	var s = 149840
	if (player.ghostify.ghostlyPhotons.unl) s += tmp.le[2]
	
	if (amount > 37460 + s) amount = Math.sqrt((amount-s) * 37460) + s
	if (tmp.rg4 && mod != "no-rg4" && !player.aarexModifications.ngp3c) amount *= 0.7
	if (player.masterystudies !== undefined && player.masterystudies.includes("d13") && mod != "noTree") amount *= getTreeUpgradeEffect(4)
	if (player.aarexModifications.ngp3c && tmp.cnd && tmp.cnd.elec) amount *= tmp.cnd.elec.eff
	return amount + 1
}

function getElectronGainMult() {
	let ret = 1
	if (hasNU(5)) ret *= 3
	return ret
}

function getElectronGainFinalMult() {
	return tmp.qu.electrons.mult * getElectronGainMult()
}

function getElectronUpgCost(u) {
	var amount = tmp.qu.electrons.rebuyables[u-1]
	if (player.aarexModifications.ngp3c && u==3) amount *= 2
	if (hasBosonicUpg(33)) amount -= tmp.blu[33]
	if (hasAch("ng3pc17")) amount -= 3
	var base = amount * Math.max(amount - 1, 1) + 1
	var exp = getElectronUpgCostScalingExp(u)
	if (exp != 1) {
		if (base < 0) base = -Math.pow(-base, exp)
		else base = Math.pow(base, exp)
	}
	if (player.aarexModifications.ngp3c) base += ([null, 82, 130, 599, 13])[u]
	else base += ([null, 82, 153, 638, 26])[u]

	if (u == 1) return nPow(10, base)
	if (u == 4) return Math.max(Math.floor(base), 0)
	return Decimal.pow(10, base)
}

function getElectronUpgCostScalingExp(u) {
	if (u == 1) return 1
	return 2
}

function getElectronUpgIncrease(u) {
	let inc = 0.25;
	if (player.achievements.includes("ng3p61") && tmp.ngp3c) inc = 0.3;
	if (tmp.ngp3c) if (player.ghostify.hb.unl && tmp.hm.electrons && player.ghostify.hb.masses.electrons) inc += tmp.hm.electrons.eff / getElectronGainMult()
	return inc;
}

function buyElectronUpg(u, quick) {
	if (!canBuyElectronUpg(u)) return false
	var cost = getElectronUpgCost(u)
	if (u == 1) player.timestudy.theorem = nS(player.timestudy.theorem, cost)
	else if (u == 2) player.dilation.dilatedTime = player.dilation.dilatedTime.sub(cost)
	else if (u == 3) player.meta.antimatter = player.meta.antimatter.sub(cost)
	else if (u == 4 && (tmp.ngp3l || !player.achievements.includes("ng3p64"))) {
		player.meta.resets -= cost
		player.meta.antimatter = getMetaAntimatterStart()
		clearMetaDimensions()
		for (let i = 2; i <= 8; i++) if (!canBuyMetaDimension(i)) document.getElementById(i + "MetaRow").style.display = "none"
	}
	tmp.qu.electrons.rebuyables[u - 1]++
	if (quick) return true
	tmp.qu.electrons.mult += getElectronUpgIncrease(u)
	updateElectrons(!tmp.ngp3l)
}

function canBuyElectronUpg(id) {
	if (!inQC(0)) return false
	if (id > 3) return player.meta.resets >= getElectronUpgCost(4)
	if (id > 2) return player.meta.antimatter.gte(getElectronUpgCost(3))
	if (id > 1) return player.dilation.dilatedTime.gte(getElectronUpgCost(2))
	return !nL(player.timestudy.theorem, getElectronUpgCost(1))
}
