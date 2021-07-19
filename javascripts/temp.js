function updateTemp(tempInit=false) {
	if (typeof player != "undefined") {
		if (player.money) {
			if (!(player.money instanceof Decimal)) player.money = new Decimal(player.money)
			tmp.ri = player.money.gte(getLimit()) && ((player.currentChallenge != "" && player.money.gte(player.challengeTarget)) || !onPostBreak())
		} else tmp.ri = false
	} else {
		tmp.ri = false
		return
	}
	tmp.nrm = 1
	if (player.timestudy.studies.includes(101)) tmp.nrm = player.replicanti.amount.max(1)
	tmp.rg4 = false
	if (tmp.ngp3) {
		updateGhostifyTempStuff(tempInit)
		if (tmp.qu.breakEternity.unlocked) updateBreakEternityUpgradesTemp()
		if (player.masterystudies.includes("d14")) updateBigRipUpgradesTemp()
		if (tmp.nrm !== 1 && player.quantum.bigRip.active) {
			if (!player.dilation.active && tmp.qu.bigRip.upgrades.includes(14) && !tmp.ngp3c) tmp.nrm = tmp.nrm.pow(tmp.bru[14])
			if (tmp.nrm.log10() > 1e9) tmp.nrm = Decimal.pow(10, 1e9 * Math.pow(tmp.nrm.log10() / 1e9, 2/3))
		}
		if (player.masterystudies.includes("d13")) updateTS431ExtraGalTemp()
		if (player.masterystudies.includes("d9")) {
			tmp.twr = getTotalWorkers()
			tmp.tra = getTotalReplicants()
		}
		updateMasteryStudyTemp()
		if (player.masterystudies.includes("d13")) tmp.branchSpeed = getBranchSpeed()
		if (tmp.an || (player.masterystudies.includes("d12") && tmp.nf !== undefined && tmp.nf.rewardsUsed !== undefined)) {
			if (!tmp.nf) updateNanoRewardTemp();
			if (tmp.nf.extra===undefined) tmp.nf.extra = 0;
			var x = getNanoRewardPowerEff()
			var y = tmp.qu.nanofield.rewards
			tmp.ns = getNanofieldSpeed()
			let uns = tmp.ngp3c;
			if (tmp.nf.powerEff !== x || tmp.nf.rewards !== y) {
				tmp.nf.powerEff = x
				tmp.nf.rewards = y
				uns = true;
			}
			if (uns) {
				updateNanoRewardPowers()
				updateNanoRewardEffects()
			}
		}
		if (player.masterystudies.includes("d10")) tmp.edgm = getEmperorDimensionGlobalMultiplier() //Update global multiplier of all Emperor Dimensions
		tmp.be = player.quantum.bigRip.active && tmp.qu.breakEternity.break
		tmp.rg4 = tmp.qu.upgrades.includes("rg4") && (tmp.qu.rg4 || !tmp.ngp3l || inQC(1) || QCIntensity(1))
		tmp.tue = getTreeUpgradeEfficiency()
	} else tmp.be = false
	tmp.sacPow = calcTotalSacrificeBoost()
	updateQCRewardsTemp()

	if (player.meta !== undefined) tmp.mdgm = getMetaDimensionGlobalMultiplier() //Update global multiplier of all Meta Dimensions
	tmp.mptb = getMPTBase()
	tmp.mpte = getMPTExp()
	updatePostInfiTemp()
	updateInfiniteTimeTemp()
	updateAntiElectronGalaxiesTemp()
	updateIntergalacticTemp() // starts with if (tmp.ngp3)
	if (hasBosonicUpg(41) && !tmp.ngp3c) {
		tmp.blu[41] = bu.effects[41]()
		tmp.it = tmp.it.times(tmp.blu[41].it)
		tmp.ig = tmp.ig.times(tmp.blu[41].ig)
	}

	tmp.rm = getReplMult()
	updateExtraReplGalaxies()
	
	updateTS232Temp()
	updateMatterSpeed()

	updateCondenseTemp(tempInit)
	updateTempAN()
	if (tmp.ngp3c) {
		updateTempBreakDilation()
		updateTempANData()
	}
	
	tmp.tsReduce = getTickSpeedMultiplier()
	updateInfinityPowerEffects()
	if (player.replicanti.unl) updateReplicantiTemp()

	if (tmp.gameSpeed != gameSpeed) {
		tmp.gameSpeed = gameSpeed
		tmp.tickUpdate = true
	}
}

let tmp = {
	nrm: new Decimal(1),
	rm: new Decimal(1),
	it: 1,
	rg4: false,
	qcs: 8,
	inQCs: [0],
	pct: "",
	ns: 1,
	bru: {},
	be: false,
	beu: {},
	bm: [200,175,150,100,50,40,30,25,20,15,10,5,4,3,2,1],
	nbc: [1,2,4,6,15,50,1e3,1e14,1e35,"1e900","1e3000", 1e185],
	nu: [],
	nuc: [null,1e6,1e7,1e8,2e8,5e8,2e9,5e9,75e8,1e10,7e12,1e18,1e55,1e125,1e160,1e280,"1e1240", "1e1350", "1e1700"],
	lt: [12800,16e4,48e4,16e5,6e6,5e7,24e7,125e7],
	lti: [2,4,1.5,10,4,1e3,2.5,3],
	effL: [0,0,0,0,0,0,0],
	ls: [0,0,0,0,0,0,0],
	le: [0,0,0,0,0,0,0],
	leBonus: {}
}

function updateRedLightBoostTemp(){
	var light0multiplier = tmp.newNGP3E ? .155 : .15
	var lighteffect0 = Math.pow(tmp.effL[0].best, .25) * light0multiplier + 1
	
	if (lighteffect0 > 1.5 && !tmp.newNGP3E) lighteffect0 = Math.log10(lighteffect0 * 20 / 3) * 1.5
	tmp.le[0] = lighteffect0
}

function updateOrangeLightBoostTemp(){
	if (tmp.effL[1] > 64) big = tmp.newNGP3E ? 10 + Math.pow(tmp.effL[1], 1/3) : Math.log10(tmp.effL[1] / 64) + 14
	tmp.le[1] = tmp.effL[1] > 64 ? big : tmp.effL[1] > 8 ? Math.sqrt(tmp.effL[1]) + 6 : tmp.effL[1] + 1
}

function updateYellowLightBoostTemp(){
	var lighteffect2 = 0 // changed later no matter what
	if (tmp.effL[2] > 60 && !tmp.newNGP3E) lighteffect2 = (Math.log10(tmp.effL[2] / 6) + 2) / 3 * Math.sqrt(1200)
	else lighteffect2 = tmp.effL[2] > 20 ? Math.sqrt(tmp.effL[2] * 20) : tmp.effL[2]
	tmp.le[2] = Math.sqrt(lighteffect2) * 45e3
}

function updateGreenLightBoostTemp(){
	var lighteffect3 = 1
	if (tmp.ngp3l) lighteffect3 = tmp.effL[3] > 8 ? Math.log10(tmp.effL[3] / 8) + Math.sqrt(12) + 1 : Math.sqrt(tmp.effL[3] * 1.5) + 1
	else lighteffect3 = Math.log10(tmp.effL[3] + 1) / 5 + 1
	tmp.le[3] = lighteffect3
}

function updateBlueLightBoostTemp(){
	var light4mult = tmp.newNGP3E ? 1.3 : 5/4
	var lighteffect4 = Math.log10(Math.sqrt(tmp.effL[4] * 2) + 1) * light4mult
	tmp.le[4] = lighteffect4
}

function updateIndigoLightBoostTemp(){
	var loglighteffect5 = tmp.effL[5] > 25 ? Math.sqrt(tmp.effL[5]*10+375) : tmp.effL[5]
	loglighteffect5 *= tmp.newNGP3E ? 20 : 10
	if (!tmp.ngp3l && loglighteffect5 > (tmp.ngp3c?64:729)) loglighteffect5 = Math.pow(loglighteffect5 * (tmp.ngp3c?8:27), 2 / 3)
	if (tmp.ngp3c && loglighteffect5 >= 100) loglighteffect5 = Math.pow(10, Math.pow(Math.log10(loglighteffect5)+2, 0.5+0.01*Math.min(player.ghostify.ghostlyPhotons.enpowerments, 10)));
	tmp.le[5] = Decimal.pow(10, loglighteffect5) 
}

function updateVioletLightBoostTemp(){
	var lightexp6 = tmp.newNGP3E ? .36 : 1/3
	var loglighteffect6 = Math.pow(player.postC3Reward.log10() * tmp.effL[6], lightexp6) * 2 
	if (loglighteffect6 > 15e3) loglighteffect6 = 15e3 * Math.pow(loglighteffect6 / 15e3, .6)
	if (!tmp.ngp3l && loglighteffect6 > 5e4) loglighteffect6 = Math.sqrt(loglighteffect6 * 5e4)
	tmp.le[6] = Decimal.pow(tmp.ngp3c?500:10, loglighteffect6)
}

function updateEffectiveLightAmountsTemp(){
	let leBonus5Unl = isLEBoostUnlocked(5)
	let leGlobal = globalLightPower();
	for (var c = 7; c >= 0; c--) {
		var x = player.ghostify.ghostlyPhotons.lights[c] + getExtraLight(c)
		if (tmp.ngp3c) {
			if (x>=15) x = Math.sqrt(x*15);
			x *= getLightCondenserEff(c+1);
		}
		var y = tmp.leBoost
		if ((c == 6 && !isLEBoostUnlocked(4)) || c == 7) y += leGlobal
		else if (leBonus5Unl) y += Math.pow(tmp.effL[c + 1] * tmp.leBonus[5].mult + Math.pow(leGlobal, 1/tmp.leBonus[5].exp), tmp.leBonus[5].exp)
		else y += Math.sqrt(tmp.effL[c + 1] + Math.pow(leGlobal, 2))
		tmp.ls[c] = y
		if (c == 0) {
			tmp.effL[0] = {
				normal: x * y, // Without best red Light
				best: (player.ghostify.ghostlyPhotons.maxRed + x * 2) / 3 * y //With best red Light
			}
		} else tmp.effL[c] = x * y
	}
	tmp.leBonus[4] = tmp.ls[6]
}

function updateFixedLightTemp() {
	if (isLEBoostUnlocked(5)) tmp.leBonus[5] = leBoosts.effects[5]()
	updateLightEmpowermentReq()
	updateEffectiveLightAmountsTemp()
	updateRedLightBoostTemp()
	updateOrangeLightBoostTemp()
	updateYellowLightBoostTemp()
	updateGreenLightBoostTemp()
	updateBlueLightBoostTemp()
	updateVioletLightBoostTemp()
	if (isLEBoostUnlocked(1)) tmp.leBonus[1] = {effect: leBoosts.effects[1]()}
	for (var b = 2; b <= leBoosts.max; b++) {
		if (!isLEBoostUnlocked(b)) break
		if (b != 4 && b != 5) {
			tmp.leBonus[b] = leBoosts.effects[b]()
			if (b == 9) tmp.apgw += Math.floor(tmp.leBonus[9])
		}
	}
}

function updateInfiniteTimeTemp() {
	var x = (3 - getTickspeed().log10()) * 0.000005
	if (tmp.ngp3) {
		if (!tmp.ngp3l && player.achievements.includes("ng3p56")) x *= 1.03
		if (ghostified && player.ghostify.neutrinos.boosts>3 && !tmp.ngp3c) x *= tmp.nb[4]
		if (tmp.be && !player.dilation.active && tmp.qu.breakEternity.upgrades.includes(8) && !tmp.ngp3c) x *= getBreakUpgMult(8)
		if (isLEBoostUnlocked(8)) x *= tmp.leBonus[8]
		x = softcap(x, "inf_time_log_1")
		if (player.aarexModifications.ngudpV) {
			if (x > 1e8) x = Math.pow(1e8 * x, .5)
			if (x > 1e9) x = Math.pow(1 + Math.log10(x), 9)
			if (tmp.be && x > 1e7) x = Math.pow(93 + Math.log10(x), 3.5)
		}
		if ((!tmp.ngp3l || player.aarexModifications.ngudpV) && player.dilation.active && x > 1e5) x = Math.pow(1e20 * x, .2)
		if (!tmp.ngp3l && !player.quantum.bigRip.active) x = softcap(x, "inf_time_log_2")
	}
	tmp.it = Decimal.pow(10, x)
}

function updateIntergalacticTemp() {
	if (!tmp.ngp3) return
	x = player.galaxies
	if (isLEBoostUnlocked(3) && !player.quantum.bigRip.active) x *= tmp.leBonus[3]
	if (tmp.be && (tmp.ngp3c?!player.dilation.active:player.dilation.active) && tmp.qu.breakEternity.upgrades.includes(10)) x *= getBreakUpgMult(10)
	if (!tmp.ngp3l) x += tmp.effAeg
	tmp.igg = x

	tmp.igs = 0 //Intergalactic Scaling ; used in the display text
	var igLog = Math.pow(x, Math.min(Math.sqrt(Math.log10(Math.max(x,1))) * 2, 2.5)) //Log10 of reward
	if (hasBosonicUpg(11) && tmp.ngp3c) igLog *= tmp.blu[11]+1
	
	if (player.quantum.bigRip.active && !tmp.ngp3l) {
		if (igLog > 1e9) { //Distant
			igLog = Math.pow(igLog * 1e3, .75)
			tmp.igs = 1
		}
		if (igLog > 1e11) { //Further
			igLog = Math.pow(Math.log10(igLog) - 1, 11)
			tmp.igs = 2
		}
		tmp.ig = Decimal.pow(10, igLog)
		return
	}
	if ((player.aarexModifications.ngudpV || !tmp.ngp3l) && igLog > (tmp.ngp3c?4e18:1e15)) { //Further
		igLog = Math.pow(10 + 6 * Math.log10(igLog), tmp.ngp3c?8.92195:7.5)
		tmp.igs = 2
	}
	if (player.aarexModifications.ngudpV && igLog > (tmp.ngp3c?7e18:1e16)) { //Remote
		igLog = Math.pow(84 + Math.log10(igLog), tmp.ngp3c?9.36436:8)
		tmp.igs = 3
	}

	if (!tmp.ngp3l && igLog > 1e20) { //Dark Matter or Ghostly or Ethereal (Cosmic in NG+3C)
		igLog = softcap(igLog, "ig_log_high")
		tmp.igs = Math.min(Math.floor(Math.log10(igLog) - 16), 8)
		if (igLog > 1e24) igLog = Math.pow(Math.pow(Math.log10(igLog), 2) + 424, 8)
	}

	tmp.ig = Decimal.pow(10, igLog)
}

function updateAntiElectronGalaxiesTemp(){
	tmp.aeg = 0
	if (hasBosonicUpg(14) && !tmp.ngp3c && !player.quantum.bigRip.active) tmp.aeg = Math.max(tmp.blu[14] - tmp.qu.electrons.sacGals, 0)
	if (hasNU(17) && tmp.ngp3c && tmp.cnd) tmp.aeg = Math.max(tmp.cnd.pe - (hasAch("ng3pc24")?0:tmp.qu.electrons.sacGals), 0)
	tmp.effAeg = tmp.aeg
	if (tmp.aeg > 0) {
		if (hasBosonicUpg(34) && !tmp.ngp3c) tmp.effAeg *= tmp.blu[34]
	}
}

function updateTS232Temp() {
	var exp = 0.2
	if (tmp.ngp3 && player.galaxies >= 1e4 && !tmp.be && !(hasBosonicUpg(52) && tmp.ngp3c)) exp *= Math.max(6 - player.galaxies / 2e3,0)
	tmp.ts232 = Math.pow(1 + initialGalaxies() / 1000, exp)
}

function updateTS431ExtraGalTemp() {
	tmp.eg431 = tmp.effAeg * (tmp.ngp3l ? 0.1 : 5)
	if (isLEBoostUnlocked(1)) {
		tmp.leBonus[1].total = (colorBoosts.g + tmp.pe - 1) * tmp.leBonus[1].effect
		tmp.eg431 += tmp.leBonus[1].total
	}
}

function updateMatterSpeed(){
	//mv: Matter speed
	tmp.mv = 1.03 + player.resets/200 + player.galaxies/100
	if (player.pSac !== undefined) {
		var exp = 10 / puMults[12](hasPU(12, true, true))
		tmp.mv = Decimal.pow(tmp.mv, exp)
	}
}

function updateReplicantiTemp() {
	var data = {}
	tmp.rep = data

	data.ln = player.replicanti.amount.ln()
	data.chance = player.replicanti.chance
	data.speeds = getReplSpeed()
	data.interval = getReplicantiFinalInterval()

	if (tmp.ngp3 && player.masterystudies.includes("t273")) {
		data.chance = Decimal.pow(data.chance, tmp.mts[273])
		data.freq = 0
		if (data.chance.gte("1e9999998")) data.freq = tmp.mts[273].times(Decimal.log10(Decimal.add(data.chance, 1)) / Math.log10(2))
	}

	data.est = Decimal.div((data.freq ? data.freq.times(Math.log10(2) / Math.log10(Math.E) * 1e3) : Decimal.add(data.chance, 1).log(Math.E) * 1e3), data.interval)
	
	
	data.estLog = data.est.times(Math.log10(Math.E))
}

function updatePostInfiTemp() {
	var exp11 = player.galacticSacrifice ? 2 : 0.5
	var exp21 = player.galacticSacrifice ? 2 : 0.5
	if (player.aarexModifications.ngmX >= 4){
		exp11 += player.totalmoney.plus(10).div(10).log10() / 1e4
		exp21 += player.money.plus(10).div(10).log10() / 1e4
	}
	tmp.postinfi11 = Math.pow(player.totalmoney.plus(10).log10(), exp11)
	tmp.postinfi21 = Math.pow(player.money.plus(10).log10(), exp21)
}

function updatePPTITemp(){
	if (!player.ghostify.ghostlyPhotons.unl) {
		tmp.ppti = 1
		return
	}
	let x = 1
	x /= tmp.le[1] || 1
	tmp.ppti = x
}

function updateGhostifyTempStuff(tempInit=false){
	updateBosonicLabTemp(tempInit)
	tmp.apgw = tmp.qu.nanofield.apgWoke || getAntiPreonGhostWake()
	updatePPTITemp() //preon power threshold increase
	if (player.ghostify.ghostlyPhotons.unl) {
		var x = getLightEmpowermentBoost()
		var y = hasBosonicUpg(32)
		if (tmp.leBoost !== x || tmp.hasBU32 !== y || tmp.updateLights || tmp.ngp3c) {
			tmp.leBoost = x
			tmp.hasBU32 = y
			tmp.updateLights = false
			updateFixedLightTemp()
		}
		updateIndigoLightBoostTemp()
		updatePhotonsUnlockedBRUpgrades()
		updateNU14Temp()
		updateNU15Temp()
	}
	if (ghostified) {
		updateNeutrinoUpgradesTemp()
		updateNeutrinoBoostsTemp()
	}
	if (tmp.ngp3c && player.ghostify.hb) if (player.ghostify.hb.unl) {
		updateNU16Temp()
		updateNU18Temp()
	}
}

function updateNeutrinoBoostsTemp() {
	tmp.nb = {}

	if (!tmp.ngp3) return
	if (!ghostified) return

	var nt = []
	for (var g = 0; g < 3; g++) nt[g] = player.ghostify.neutrinos[(["electron","mu","tau"])[g]]
	for (var nb = 1; nb <= player.ghostify.neutrinos.boosts; nb++) tmp.nb[nb] = neutrinoBoosts.boosts[nb](nt)
	tmp.nbc[1] = tmp.ngp3c?1:2;
	tmp.nbc[2] = tmp.ngp3c?3:4;
	tmp.nbc[8] = tmp.ngp3c?4e19:1e35;
	tmp.nbc[9] = tmp.ngp3c?1e96:"1e900";
	tmp.nbc[10] = tmp.ngp3c?1e125:"1e3000"
}

function updateNU1Temp(){
	let x = 110
	if (!tmp.qu.bigRip.active) x = Math.max(x - player.meta.resets, 0)
	tmp.nu[0] = x
}

function updateNU3Temp(){
	let log = tmp.qu.colorPowers.b.log10()
	let exp = Math.max(log / 1e4 + 1, 2)
	let x
	if (exp > 2) x = Decimal.pow(Math.max(log / 250 + 1, 1), exp)
	else x = Math.pow(Math.max(log / 250 + 1, 1), exp)
	tmp.nu[1] = x
}

function updateNU4Temp(){
	let nu4base = 50
	if (tmp.ngp3l) nu4base = 20
	if (tmp.ngp3c) nu4base = 5
	let nu4req = 4e13;
	if (tmp.ngp3c) nu4req = 2e11;
	let nu4sub = 4;
	if (tmp.ngp3c) nu4sub = 1;
	tmp.nu[2] = Decimal.pow(nu4base, Math.pow(Math.max(-getTickspeed().div(1e3).log10() / nu4req - nu4sub, 0), 1/4))
}

function updateNU7Temp(){
	var nu7 = tmp.qu.colorPowers.g.add(1).log10()/400
	if (nu7 > (tmp.ngp3c?3:40)) nu7 = Math.sqrt(nu7*(tmp.ngp3c?(4/3):10))+(tmp.ngp3c?1:20)
	tmp.nu[3] = Decimal.pow(10,nu7) 
}

function updateNU12Temp(){ // NU12
	if (tmp.ngp3c) {
		tmp.nu[4] = {
			normal: Math.pow(getTotalCondensers("normal") * .000035 + 1, 1/3),
			inf: Math.sqrt(Math.log10(getTotalCondensers("inf") + 1) / 10 + 1),
			time: Math.pow(getTotalCondensers("time") / 777 + 1, 1/7),
			meta: Decimal.pow(1e77, getTotalCondensers("meta")),
			emp: Decimal.pow(100, Math.sqrt(getTotalCondensers("emp")))
		}
	} else {
		tmp.nu[4] = { 
			normal: Math.sqrt(player.galaxies * .0035 + 1),
			free: player.dilation.freeGalaxies * .035 + 1,
			replicated: Math.sqrt(getTotalRG()) * (tmp.ngp3l ? .035 : .0175) + 1
		}
	}
}

function updateNU14Temp(){
	var base = player.ghostify.ghostParticles.add(1).log10()
	var colorsPortion = Math.pow(tmp.qu.colorPowers.r.add(tmp.qu.colorPowers.g).add(tmp.qu.colorPowers.b).add(1).log10(),1/3)
	let nu5 = Decimal.pow(base, colorsPortion * 0.8 + 1).max(1)
	if (tmp.ngp3c) nu5 = Decimal.pow(3, Math.sqrt(nu5.log(3)));
	tmp.nu[5] = nu5 //NU14
}

function updateNU15Temp(){
	tmp.nu[6] = Decimal.pow(2,(tmp.qu.nanofield.rewards>90?Math.sqrt(90*tmp.qu.nanofield.rewards):tmp.qu.nanofield.rewards) / (tmp.ngp3c?4:2.5)) 
	//NU15
}

function updateNU16Temp() {
	tmp.nu[7] = Math.sqrt(Decimal.add(getReplicantiCap(), 1).log(Number.MAX_VALUE)/(tmp.qu.bigRip.active?1e9:1e10)+1)
	//NU16
}

function updateNU18Temp() {
	let e = player.ghostify.ghostlyPhotons.enpowerments;
	if (e>=25) e = Math.sqrt(e*25)
	tmp.nu[8] = Math.round(e)
	//NU18
}

function updateNeutrinoUpgradesTemp(){
	updateNU1Temp()
	updateNU3Temp()
	updateNU4Temp()
	updateNU7Temp()
	updateNU12Temp()
	
	tmp.nuc[1] = tmp.ngp3c?1e5:1e6
	tmp.nuc[2] = tmp.ngp3c?4e5:1e7
	tmp.nuc[3] = tmp.ngp3c?1e6:1e8
	tmp.nuc[4] = tmp.ngp3c?6e6:2e8
	tmp.nuc[5] = tmp.ngp3c?2e7:5e8
	tmp.nuc[6] = tmp.ngp3c?7.5e7:2e9
	tmp.nuc[7] = tmp.ngp3c?2e8:5e9
	tmp.nuc[8] = tmp.ngp3c?1.5e9:7.5e9
	tmp.nuc[10] = tmp.ngp3c?1.5e11:7e12
	tmp.nuc[12] = tmp.ngp3c?2e33:1e55
	tmp.nuc[13] = tmp.ngp3c?1e185:1e125
	tmp.nuc[14] = tmp.ngp3c?1e200:1e160
	tmp.nuc[15] = tmp.ngp3c?1e240:1e280
}

function updateBreakEternityUpgrade1Temp(){
	var ep = player.eternityPoints
	var em = tmp.qu.breakEternity.eternalMatter
	var log1 = ep.div(tmp.ngp3c?(ghostified?"1e8250":"1e8300"):"1e1280").add(1).log10()
	var log2 = em.times(10).max(1).log10()
	let b = Math.pow(log1, 1/3) * 0.5 + Math.pow(log2, 1/3)
	tmp.beu[1] = tmp.ngp3c ? (Math.pow(Math.log10(b+1), 3)*5+1) : Decimal.pow(10, b).max(1)
}

function updateBreakEternityUpgrade2Temp(){
	var ep = player.eternityPoints
	var log = ep.div("1e1290").add(1).log10()
	tmp.beu[2] = Math.pow(Math.log10(log + 1) * 1.6 + 1, player.currentEternityChall == "eterc10" ? 1 : 2)
}

function updateBreakEternityUpgrade3Temp(){
	var ep = player.eternityPoints
	var nerfUpgs = !tmp.be && hasBosonicUpg(24) && !tmp.ngp3c
	var log = ep.div(tmp.ngp3c?"1e8150":"1e1370").add(1).log10()
	if (nerfUpgs) log /= 2e6
	var exp = Math.pow(log, tmp.ngp3c?(1/5):(1/3)) * 0.5
	if (!tmp.ngp3l) exp = softcap(exp, "beu3_log")
	tmp.beu[3] = Decimal.pow(10, exp)
}

function updateBreakEternityUpgrade4Temp(){
	var ep = player.eternityPoints
	var ss = tmp.qu.bigRip.spaceShards
	var log1 = ep.div("1e1860").add(1).log10()
	var log2 = ss.div("7e19").add(1).log10()
	var exp = Math.pow(log1, 1/3) + Math.pow(log2, 1/3) * 8
	if (!tmp.ngp3l && exp > 333) exp = 111 * Math.log10(3 * exp + 1)
	tmp.beu[4] = Decimal.pow(10, exp)
}

function updateBreakEternityUpgrade5Temp(){
	var ep = player.eternityPoints
	var ts = player.timeShards
	var log1 = ep.div("1e2230").add(1).log10()
	var log2 = ts.div(tmp.ngp3c?1e20:1e90).add(1).log10()
	var exp = Math.pow(log1, 1/3) + Math.pow(log2, 1/3)
	if ((player.aarexModifications.ngudpV||tmp.ngp3c) && exp > 100) exp = player.aarexModifications.ngudpV?(Math.log10(exp) * 50):(Math.pow(Math.log10(exp), 4) * 6.25)
	if (!tmp.ngp3l && exp > 999) exp = 333 * Math.log10(exp + 1)
	exp *= tmp.ngp3c?0.5:4
	tmp.beu[5] = Decimal.pow(10, exp)
}

function updateBreakEternityUpgrade6Temp(){
	var ep = player.eternityPoints
	var em = tmp.qu.breakEternity.eternalMatter
	var nerfUpgs = !tmp.be && hasBosonicUpg(24) && !tmp.ngp3c
	var log1 = ep.div("1e4900").add(1).log10()
	var log2 = em.div(1e45).add(1).log10()
	if (nerfUpgs) log1 /= 2e6
	var exp = Math.pow(log1, 1/3) / 1.7 + Math.pow(log2, 1/3) * 2
	if (!tmp.ngp3l && exp > 200) exp = 50 * Math.log10(50 * exp)
	tmp.beu[6] = Decimal.pow(10, exp)
}

function updateBreakEternityUpgrade8Temp(){
	var x = Math.log10(player.dilation.tachyonParticles.div(1e200).add(1).log10() / 100 + 1) * 3 + 1
	if (player.aarexModifications.ngudpV && x > 2.2) x = 1.2 + Math.log10(x + 7.8)
	if (!tmp.ngp3l) {
		if (x > 3) x = 1 + Math.log2(x + 1)
		if (x > 10/3) x = 7/3 + Math.log10(3 * x)
	}
	tmp.beu[8] = x
}

function updateBreakEternityUpgrade9Temp(){
	var em = tmp.qu.breakEternity.eternalMatter
	var x = em.div(tmp.ngp3c?"1e185":"1e335").add(1).pow(0.05 * Math.log10(4))
	if (!tmp.ngp3l) {
		if (x.gte(Decimal.pow(10,18))) x = Decimal.pow(x.log10() * 5 + 10, 9)
		if (x.gte(Decimal.pow(10,100))) x = Decimal.pow(x.log10(), 50)
	}
	tmp.beu[9] = x.toNumber()
}

function updateBreakEternityUpgrade10Temp(){
	var ep = player.eternityPoints
	let beu10 = Math.max(Math.log10(ep.add(1).log10() + 1) - 1, 1)
	if (tmp.ngp3c) beu10 = Math.sqrt(beu10)
	tmp.beu[10] = beu10;
}

function updateBreakEternityUpgradesTemp() {
	//Setup
	var ep = player.eternityPoints
	var ts = player.timeShards
	var ss = tmp.qu.bigRip.spaceShards
	var em = tmp.qu.breakEternity.eternalMatter
	var nerfUpgs = !tmp.be && hasBosonicUpg(24) && !tmp.ngp3c

	updateBreakEternityUpgrade1Temp()
	updateBreakEternityUpgrade2Temp()
	updateBreakEternityUpgrade3Temp()
	if (!tmp.ngp3c) updateBreakEternityUpgrade4Temp()
	updateBreakEternityUpgrade5Temp()
	updateBreakEternityUpgrade6Temp()

	//Upgrade 7: EP Mult
	tmp.beu[7] = Decimal.pow(getBE7Base(), tmp.qu.breakEternity.epMultPower)

	if (player.ghostify.ghostlyPhotons.unl) {
		updateBreakEternityUpgrade8Temp()
		updateBreakEternityUpgrade9Temp()
		updateBreakEternityUpgrade10Temp()
	}
}

function updateBRU1Temp() {
	tmp.bru[1] = 1
	if (!tmp.qu.bigRip.active) return
	let exp = 1
	if (tmp.qu.bigRip.upgrades.includes(17) && !tmp.ngp3c) exp = tmp.bru[17]
	if (ghostified && player.ghostify.neutrinos.boosts > 7 && !tmp.ngp3c) exp *= tmp.nb[8]
	exp *= player.infinityPoints.max(1).log10()
	exp = softcap(exp, "bru1_log", tmp.ngp3l ? 1 : 2)
	tmp.bru[1] = Decimal.pow(10, exp) // BRU1
}

function updateBRU4Temp() {
	tmp.bru[4] = 1
	if (!tmp.qu.bigRip.active) return;
	let eff = player.replicanti.amount.pow(0.34).max(1);
	let exp = 1;
	if (tmp.qu.bigRip.upgrades.includes(17) && tmp.ngp3c) exp = tmp.bru[17]
	tmp.bru[4] = eff.pow(exp);
}

function updateBRU8Temp() {
	tmp.bru[8] = 1
	if (!tmp.qu.bigRip.active) return
	tmp.bru[8] = Decimal.pow(2,getTotalRG()) // BRU8
	if (!hasNU(11)) tmp.bru[8] = tmp.bru[8].min(Number.MAX_VALUE)
}

function updateBRU14Temp() {
	if (!tmp.qu.bigRip.active) {
		tmp.bru[14] = 1
		return
	}
	var ret = Math.min(tmp.qu.bigRip.spaceShards.div(3e18).add(1).log10()/3,0.4)
	var val = Math.sqrt(tmp.qu.bigRip.spaceShards.div(3e15).add(1).log10()*ret+1)
	if (val > 12) val = 10 + Math.log10(4 + 8 * val)
	tmp.bru[14] = val //BRU14
}

function updateBRU15Temp() {
	let mult = tmp.ngp3c ? 4.77 : 3.55
	let r = Math.sqrt(player.eternityPoints.add(1).log10()) * mult
	if (r > 1e4 && !tmp.ngp3l) r = Math.sqrt(r * 1e4)
	tmp.bru[15] = r
}

function updateBRU16Temp() {
	tmp.bru[16] = player.dilation.dilatedTime.div(1e100).pow(tmp.ngp3c?0.0277:0.155).max(1)
	if (tmp.ngp3c) tmp.bru[16] = Decimal.pow(10, Math.sqrt(tmp.bru[16].log10()));
}

function updateBRU17Temp() {
	let r = !tmp.ngp3l && ghostified ? 3 : 2.9
	if (tmp.ngp3c) r -= 1
	tmp.bru[17] = r;
}

function updateBigRipUpgradesTemp(){
	updateBRU17Temp()
	updateBRU1Temp()
	updateBRU4Temp()
	updateBRU8Temp()
	updateBRU14Temp()
	updateBRU15Temp()
	updateBRU16Temp()
}

function updatePhotonsUnlockedBRUpgrades(){
	var bigRipUpg18base = 1 + tmp.qu.bigRip.spaceShards.div(1e140).add(1).log10()
	var bigRipUpg18exp = Math.max(tmp.qu.bigRip.spaceShards.div(1e140).add(1).log10() / 10, 1)
	if (bigRipUpg18base > 10 && tmp.newNGP3E) bigRipUpg18base *= Math.log10(bigRipUpg18base)
	tmp.bru[18] = Decimal.pow(bigRipUpg18base, bigRipUpg18exp) // BRU18
	
	var bigRipUpg19exp = Math.sqrt(player.timeShards.add(1).log10()) / (tmp.newNGP3E ? 60 : 80)
	tmp.bru[19] = Decimal.pow(10, bigRipUpg19exp) // BRU19
}

function updateBosonicAMDimReturnsTemp() {
	var data = {}
	tmp.badm = data

	if (!tmp.ngp3) return
	if (tmp.ngp3l) return
	if (!player.ghostify.wzb.unl) return

	data.start = getHiggsRequirement((player.achievements.includes("ng3p93") && tmp.ngp3c)?Math.max(Math.ceil(player.ghostify.hb.higgs*1.5-1), player.ghostify.hb.higgs):player.ghostify.hb.higgs)
	data.base = getHiggsRequirementMult()
	data.offset = 1 / Math.log(data.base) - 1
	data.offset2 = 1 - Math.log10(data.offset + 1) / Math.log10(data.base)
	data.postDim = player.ghostify.bl.am.div(data.start)
	data.preDim = Decimal.pow(data.base,  Decimal.log(100, data.postDim) - data.offset2).add(-data.offset).max(1)
}

function updateBosonicEnchantsTemp(){
	tmp.bEn.lvl = {}
	tmp.bEn.totalLvl = new Decimal(0)
	for (var g2 = 2; g2 <= br.limit; g2++) for (var g1 = 1; g1 < g2; g1++) {
		var id = g1 * 10 + g2
		tmp.bEn.lvl[id] = player.ghostify.bl.enchants[id] || new Decimal(0)
		tmp.bEn.totalLvl = tmp.bEn.totalLvl.plus(tmp.bEn.lvl[id])
		if (bEn.effects[id] !== undefined) tmp.bEn[id] = getEnchantEffect(id)
	}
	tmp.bEn.totalLvlEffect = tmp.ngp3c?getBENTotalLevelEffect():new Decimal(1);
}

function updateBosonicUpgradesTemp(){
	for (var r = bu.rows; r >= 1; r--) for (var c = 5; c > 0; c--) {
		var id = r * 10 + c
		if (bu.effects[id] !== undefined) tmp.blu[id] = bu.effects[id]()
	}
}

function updateWZBosonsTemp(){
	var data = tmp.wzb
	var wpl = player.ghostify.wzb.wpb.add(1).log10()
	var wnl = player.ghostify.wzb.wnb.add(1).log10()

	var bosonsExp = Math.max(wpl * (player.ghostify.wzb.wpb.sub(player.ghostify.wzb.wnb.min(player.ghostify.wzb.wpb))).div(player.ghostify.wzb.wpb.max(1)).toNumber(), 0)
	if (tmp.ngp3c) {
		bosonsExp = Math.pow(bosonsExp, player.ghostify.bl.UPGSUNL?.6:.5);
		if (player.ghostify.bl.upgrades.length>7) bosonsExp += .5;
		if (tmp.an) bosonsExp /= 10
	}
	
	data.wbt = Decimal.pow((tmp.newNGP3E||tmp.ngp3c) ? 5 : 3, bosonsExp) //W Bosons boost to extract time
	if (tmp.ngp3c) if (player.ghostify.hb.unl && tmp.hm && tmp.hm.wb && player.ghostify.hb.masses.wb) data.wbt = data.wbt.times(tmp.hm.wb.eff).sqrt().max(data.wbt)
	
	data.wbo = Decimal.pow(10, Math.max(bosonsExp, 0)) //W Bosons boost to Z Neutrino oscillation requirement
	if (hasAch("ng3pc15")) data.wbo = data.wbo.pow(2);
	
	let wbp = player.ghostify.wzb.wpb.add(player.ghostify.wzb.wnb).div(tmp.ngp3c?((player.ghostify.bl.upgrades.length>1)?.01:.1):100).max(1)
	if (tmp.ngp3c) wbp = Decimal.pow(2, Math.pow(wbp.log2(), .95));
	data.wbp = tmp.an?wbp.root(30):wbp.pow((player.ghostify.bl.upgrades.length>4&&tmp.ngp3c)?(2 / 3+Math.max((Math.min(player.ghostify.bl.upgrades.length, 10)-6)/5, 0)):(1 / 3)).sub(tmp.ngp3c?0:1) //W Bosons boost to Bosonic Antimatter production

	var zbslog = player.ghostify.wzb.zb.div(10).add(1).sqrt().log10()
	if (tmp.ngp3c) zbslog *= Math.log10(player.ghostify.bl.upgrades.length + 1) + 1
	data.zbs = Decimal.pow(10, Math.pow(zbslog, tmp.ngp3c?.8:1)) //Z Bosons boost to W Quark
	if (tmp.ngp3c) if (player.ghostify.hb.unl && tmp.hm && player.ghostify.hb.masses.zb) data.zbs = data.zbs.pow(1+tmp.hm.zb.eff);

	data.spd = getWZBosonSpeed();
}

function updateNanoEffectUsages() {
	var data = []
	tmp.nf.rewardsUsed = data
	nanoRewards.effectToReward = {}

	//First reward
	var data2 = [hasBosonicUpg(21) ? "supersonic_start" : "hatch_speed"]
	nanoRewards.effectsUsed[1] = data2

	//Third reward
	var data2 = ["dil_gal_gain"]
	if (hasAch("ng3pc18")) data2.push("light_threshold_speed")
	nanoRewards.effectsUsed[3] = data2

	//Fifth reward
	var data2 = [tmp.ngp3c ? "infdim_eff_exp" : "dil_effect_exp"]
	if (!tmp.ngp3l && !tmp.ngp3c) data2.push("light_threshold_speed")
	nanoRewards.effectsUsed[5] = data2

	//Seventh reward
	let bu22 = hasBosonicUpg(22)
	var data2 = [bu22 ? "neutrinos" : "remote_start", "preon_charge"]
	if (tmp.ngp3c && bu22) data2.push("remote_start")
	nanoRewards.effectsUsed[7] = data2

	//Used Nanofield rewards
	for (var x = 1; x <= 8; x++) {
		var rewards = nanoRewards.effectsUsed[x]
		for (var r = 0; r < rewards.length; r++) {
			data.push(rewards[r])
			nanoRewards.effectToReward[rewards[r]] = x
		}
	}
}

function updateNanoRewardPowers() {
	var data = {}
	tmp.nf.powers = data

	for (var x = 1; x <= 8; x++) data[x] = getNanoRewardPower(x, tmp.nf.rewards)
}

function updateNanoRewardEffects() {
	tmp.nf.extra = getExtraNanoRewards()
	
	var data = {}
	tmp.nf.effects = data

	for (var e = 0; e < (tmp.nf.rewardsUsed||[]).length; e++) {
		var effect = tmp.nf.rewardsUsed[e]
		tmp.nf.effects[effect] = nanoRewards.effects[effect](tmp.nf.powers[nanoRewards.effectToReward[effect]])
	}
}

function updateNanoRewardScalings() {
	if (!tmp.nf.scalings) tmp.nf.scalings = {}
	tmp.nf.scalings.active = getActiveNanoScalings()
	tmp.nf.scalings.start = getNanoScalingsStart()
	tmp.nf.scalings.bases = getNanoScalingsBases()
	tmp.nf.lastScale = getLastNFScale()
	if (!tmp.nf.scaleSpeed) tmp.nf.scaleSpeed = 1
}

function updateNanoRewardTemp() {
	if (!tmp.nf) tmp.nf = {}

	if (!tmp.ngp3) return
	if (!player.masterystudies.includes("d11")) return

	updateNanoEffectUsages()
	if (!tmp.nf.scalings) updateNanoRewardScalings()
	//The rest is calculated by updateTemp().
}

function updateHiggsMechanismTemp(tempInit=false) {
	if (!tmp.hm || tempInit) tmp.hm = {}
	
	let h = (player.ghostify.hb.higgs||0);
	if (player.ghostify.bl.usedEnchants.includes(35) && tmp.ngp3c) h *= (tmp.bEn[35] || 1);
	tmp.hm.baseEff = Math.log(h/10+1)
	tmp.hm.gb = getParticleMassGainBase()
	tmp.hm.unlocks = 0;
	for (let type in hm) {
		if (type=="limit") continue;
		if (!tmp.hm[type]) tmp.hm[type] = {};
		tmp.hm[type].gain = hm[type].gain(tmp.an?Math.sqrt((tmp.hb.higgs||0)/250):tmp.hb.higgs||0);
		tmp.hm[type].eff = hm[type].eff(tmp.hb.masses[type]||new Decimal(0));
		if (tmp.hb.masses[type]!==undefined) tmp.hm.unlocks++;
	}
}

function updateCondenseTemp(tempInit) {
	if (!tmp.cnd || tempInit) tmp.cnd = {}
	
	if (!player.aarexModifications.ngp3c) return;
	
	if (!tmp.cnd.nrm) tmp.cnd.nrm = {}
	if (!tmp.cnd.inf) tmp.cnd.inf = {}
	if (!tmp.cnd.time) tmp.cnd.time = {}
	if (!tmp.cnd.meta) tmp.cnd.meta = {}
	if (!tmp.cnd.emp) tmp.cnd.emp = {}
	if (!tmp.cnd.nano) tmp.cnd.nano = {}
	for (let i=1;i<=8;i++) {
		tmp.cnd.nrm[i] = getCondenserEff(i)
		tmp.cnd.inf[i] = getInfCondenserEff(i)
		tmp.cnd.time[i] = getTimeCondenserEff(i)
		tmp.cnd.meta[i] = getMetaCondenserEff(i)
		tmp.cnd.emp[i] = getEmpCondenserEff(i)
		tmp.cnd.nano[i] = getNanoCondenserEff(i)
	}
	
	if (!tmp.cnd.repl) tmp.cnd.repl = {}
	tmp.cnd.repl.pow = getReplCondPow()
	let repl = player.replicanti.amount
	repl = softcap(repl, "condenseRepl")
	tmp.cnd.repl.eff1 = Decimal.pow(new Decimal(repl.max(1).log10()).div(3).plus(1), Math.sqrt(player.condensed.repl*tmp.cnd.repl.pow)/4)
	let c2 = player.condensed.repl
	if (c2>=2) c2 = Math.pow(c2*4, 1/3)
	if (c2>9) c2 = Math.pow(c2, 3)/81
	tmp.cnd.repl.eff2 = new Decimal(repl.max(1).log10()).div(3).times(Math.pow(c2*tmp.cnd.repl.pow, 0.95)/2.5).times(player.timestudy.studies.includes(24)?(player.timestudy.studies.includes(197)?(repl.plus(1).log10()+2):2):1).plus(1).times(hasBosonicUpg(14) ? tmp.blu[14]||1 : 1)

	if (player.timestudy.studies.includes(23)) tmp.cnd.repl.eff1 = tmp.cnd.repl.eff1.plus(tmp.cnd.repl.eff2.sub(1).max(0))

	tmp.cnd.ic9 = getIC9Eff()
	tmp.cnd.extraInf = getExtraInfConds()
	
	if (!tmp.cnd.elec) tmp.cnd.elec = {}
	tmp.cnd.elec.eff = getElecCondEff()
	
	tmp.cnd.pe = 0
	if (player.masterystudies.includes("d10")) tmp.cnd.pe = Math.min(Math.floor(getCondPreonEff()), hasNU(17)?(1/0):player.quantum.electrons.sacGals)

	tmp.ts413 = getMTSMult(413);

	tmp.cnd.lightPow = getLightCondenserPow()
}

function updateTempBreakDilation() {
	updateTempCosmicOrbs();

	if (!tmp.bdt) tmp.bdt = {};
	tmp.bdt.upgPow = getBDUpgPower()
	if (!tmp.bdt.upgs) tmp.bdt.upgs = {};
	for (let i=1;i<=BDUpgs.amt;i++) tmp.bdt.upgs[i] = BDUpgs[i].eff(tmp.bdt.upgPow);

	tmp.bdt.radGain = getCherenkovRadGain();
	tmp.bdt.radEff = getCherenkovRadEff(); 
	tmp.bdt.radEffFlipped = tmp.bdt.radEff.lt(1)
}

function updateTempCosmicOrbs() {
	if (!tmp.co) tmp.co = {};
	tmp.co.amt = tmp.bd?(tmp.bd.cp||0):0

	tmp.co.posAmt = posCosmicOrbPower(tmp.co.amt);
	tmp.co.plus1 = cosmicOrbEffects.plus1(tmp.co.posAmt)
	tmp.co.plus2 = cosmicOrbEffects.plus2(tmp.co.posAmt)
	tmp.co.plus3 = cosmicOrbEffects.plus3(tmp.co.amt) // not affected by Positive Cosmic Orb Power

	tmp.co.negAmt = negaCosmicOrbPower(tmp.co.amt);
	tmp.co.minus1 = cosmicOrbEffects.minus1(tmp.co.negAmt)
	tmp.co.minus2 = cosmicOrbEffects.minus2(tmp.co.negAmt)
	tmp.co.minus3 = cosmicOrbEffects.minus3(tmp.co.negAmt)
}

function updateTempAN() { tmp.an = tmp.ngp3c && player.ghostify.annihilation.active }

function updateTempANData() {
	tmp.and = {};
	tmp.and.exTarg = tmp.qu.bigRip.active?(tmp.an?"Meta Condensers":"Time Condensers"):(tmp.an?"Dilation Condensers":"Nano-Condensers")
	tmp.and.exEff = getExoticMatterEff(tmp.and.exTarg)
	tmp.and.study = {};
	for (let i=0;i<exoticStudies.filter(x => x.eff).length; i++) {
		let data = exoticStudies.filter(x => x.eff)[i];
		tmp.and.study[data.id] = data.eff();
	}
}