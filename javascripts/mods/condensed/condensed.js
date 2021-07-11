function loadCondensedVars() {
	if (player.condensed === undefined) {
		player.condensed = {
			normal: [null, 0, 0, 0, 0, 0, 0, 0, 0],
			inf: [null, 0, 0, 0, 0, 0, 0, 0, 0],
			time: [null, 0, 0, 0, 0, 0, 0, 0, 0],
			meta: [null, 0, 0, 0, 0, 0, 0, 0, 0],
			emp: [null, 0, 0, 0, 0, 0, 0, 0, 0],
			autoEmp: false,
			nano: [null, 0, 0, 0, 0, 0, 0, 0, 0],
			light: [null, 0, 0, 0, 0, 0, 0, 0, 0],
			repl: 0,
			elec: 0,
			obsc: {},
		}
	}
	if (player.condensed.inf === undefined) player.condensed.inf = [null, 0, 0, 0, 0, 0, 0, 0, 0]
	if (player.condensed.repl === undefined) player.condensed.repl = 0
	if (player.condensed.time === undefined) player.condensed.time = [null, 0, 0, 0, 0, 0, 0, 0, 0]
	if (player.condensed.meta === undefined) player.condensed.meta = [null, 0, 0, 0, 0, 0, 0, 0, 0]
	if (player.condensed.elec === undefined) player.condensed.elec = 0
	if (player.condensed.emp === undefined) player.condensed.emp = [null, 0, 0, 0, 0, 0, 0, 0, 0]
	if (player.condensed.autoEmp === undefined) player.condensed.autoEmp = false;
	if (player.condensed.nano === undefined) player.condensed.nano = [null, 0, 0, 0, 0, 0, 0, 0, 0]
	if (player.condensed.light === undefined) player.condensed.light = [null, 0, 0, 0, 0, 0, 0, 0, 0]
	if (player.infchallengeTimes[9] === undefined) {
		player.infchallengeTimes.push(600*60*24*31)
		player.infchallengeTimes.push(600*60*24*31)
	}
	if (player.condensed.obsc === undefined) player.condensed.obsc = {}
	if (tmp.qu.bigRip.tss === undefined) tmp.qu.bigRip.tss = new Decimal(0);
	if (player.ghostify.hb.masses === undefined) player.ghostify.hb.masses = {};
	if (player.ghostify.hb.mechType === undefined) player.ghostify.hb.mechType = 0;
	
	if (player.dilation.break === undefined) initBreakDilationPlayerData();
	else {
		player.dilation.break.rads = new Decimal(player.dilation.break.rads||0);
		matchTempPlayerBD();
	}
}

function loadCondensedData(resetNum=0) { // 1: DimBoost, 2: Galaxy, 3: Infinity, 4: Eternity, 5: Quantum, 6: Ghostify
	if (!player.aarexModifications.ngp3c) return;
	// Load Stuff
	let preVer = player.aarexModifications.ngp3c||0
	loadCondensedVars();
	
	// Reset Stuff
	if (resetNum>=1) {
		player.condensed.normal = [null, 0, 0, 0, 0, 0, 0, 0, 0]
	}
	if (resetNum>=4) {
		player.condensed.inf = [null, 0, 0, 0, 0, 0, 0, 0, 0]
		player.condensed.repl = (player.eternities>=50&&resetNum==4)?5:0
	}
	if (resetNum>=5) {
		player.condensed.time = [null, 0, 0, 0, 0, 0, 0, 0, 0]
		player.condensed.meta = [null, 0, 0, 0, 0, 0, 0, 0, 0]
	}
	if (resetNum>=6) {
		if (resetNum>6 || player.ghostify.milestones<=2) player.condensed.elec = 0
		player.condensed.emp = [null, 0, 0, 0, 0, 0, 0, 0, 0]
		if (resetNum>6 || !player.achievements.includes("ng3p66")) player.condensed.nano = [null, 0, 0, 0, 0, 0, 0, 0, 0]
	}
	if (resetNum>=7) {
		player.condensed.light = [null, 0, 0, 0, 0, 0, 0, 0, 0]
		initBreakDilationPlayerData();
	}
	
	if (preVer<1.1) {
		for (let i=5;i<=8;i++) player["timeDimension"+i].cost = timeDimCost(i, player["timeDimension"+i].bought)
	}
	if (preVer<1.21) {
		tmp.qu.replicants.quantumFoodCost = getQFBaseCost();
		tmp.qu.replicants.limitCost = getReplicantLimitBaseCost();
		tmp.qu.replicants.hatchSpeedCost = getHatchSpeedBaseCost();
	}
	if (preVer<1.22) {
		tmp.qu.replicants.requirement = getReplicantBaseReq();
	}
	if (preVer<1.23 && tmp.qu.replicants.quantumFoodCost.eq(2e46) && tmp.qu.replicants.limitCost.eq(1e49) && tmp.qu.replicants.hatchSpeedCost.eq(1e49)) {
		tmp.qu.replicants.quantumFoodCost = getQFBaseCost();
		tmp.qu.replicants.limitCost = getReplicantLimitBaseCost();
		tmp.qu.replicants.hatchSpeedCost = getHatchSpeedBaseCost();
	}
	if (preVer<1.24) tmp.qu.bigRip.tss = new Decimal(0);
	if (preVer<1.25) player.condensed.autoEmp = false;
	if (preVer<1.28) {
		player.ghostify.hb.masses = {};
		player.ghostify.hb.mechType = 0;
	}

	player.aarexModifications.ngp3c = 1.3;
}

function updateCondensedUnlocks() {
	updateBreakDilationUnlocks();
	updateAnnihilationUnlocks();
}

function doCondensedUnlocks() {
	if (tmp.bd?(!tmp.bd.unl):false) if (canUnlockBD()) unlockBreakDilation();
}

function getTotalCondensers(type) {
	return player.condensed[type].filter(x => x!=null).reduce((a,c) => a+c);
}

const CONDENSER_START = {
	1: 100,
	2: 1e4,
	3: 1e8,
	4: 1e16,
	5: 1e32,
	6: 1e45,
	7: 1e65,
	8: 1e80,
}

const CONDENSER_BASE = {
	1: 10,
	2: 25,
	3: 100,
	4: 1e4,
	5: 1e8,
	6: 1e10,
	7: 1e15,
	8: 1e20,
}

function getCondenserCostScaling() {
	let s = 1
	if (player.infinityUpgrades.includes("postinfi70")) s *= 0.6
	if (player.eternityUpgrades.includes(12)) s *= 2/3
	s *= 1-tmp.qcRewards[8]
	return s
}

function getCondenserCostDiv() {
	let div = new Decimal(1)
	if (player.timestudy.studies.includes(202)) div = div.times(ts202Eff())
	return div;
}

function getCondenserCost(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(1/0);
	let bought = player.condensed.normal[x]
	return Decimal.pow(CONDENSER_BASE[x], Decimal.pow(bought, 1+1.5**getCondenserCostScaling())).times(CONDENSER_START[x]).div(getCondenserCostDiv())
}

function getCondenserTarget(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(0);
	let res = getOrSubResource(x)
	let target = Math.pow(res.times(getCondenserCostDiv()).div(CONDENSER_START[x]).max(1).log10()/Math.log10(CONDENSER_BASE[x]), 1/(1+1.5**getCondenserCostScaling()))
	return Math.floor(target+1)
}

function getCondenserPow() {
	if (player.currentChallenge == "postcngc_1") return new Decimal(0)
	
	let pow = new Decimal(1)
	if (player.galaxies>=2) pow = pow.times((Math.sqrt(player.galaxies*2)*2)/3)
	if (player.infinityUpgrades.includes("postinfi70")) pow = pow.times(getPostInfi70Mult())
	if (player.infinityUpgrades.includes("postinfi72")) pow = pow.times(getPostInfi72Mult())
	if (player.challenges.includes("postc4")) pow = pow.times(1.25)
	if (player.challenges.includes("postcngc_2")) pow = pow.times(1.15)
	if (player.masterystudies.includes("t267")) pow = pow.times(1.5)
	if (hasBosonicUpg(25)) pow = pow.times(tmp.blu[25])
	return pow
}

function getFreeCondensers() {
	let c = 0;
	if (player.masterystudies.includes("d13")) c += getTreeUpgradeEffect(9);
	if (ghostified && player.ghostify.neutrinos.boosts >= 3) c += tmp.nb[3];
	return c;
}

function getCondenserEff(x) {
	return Decimal.pow(player.money.plus(1).log10()+1, Decimal.mul(player.condensed.normal[x]+getFreeCondensers(), getCondenserPow()))
}

function updateCondenser(x) {
	if (!player.aarexModifications.ngp3c) return;
	let costPart = quantumed ? '' : 'Condense: '
	let cost = getCondenserCost(x)
	let resource = getOrSubResource(x)
	document.getElementById("Condense"+x).textContent = costPart + shortenPreInfCosts(cost)
	document.getElementById("Condense"+x).className = (resource.gte(cost)&&player[TIER_NAMES[x]+"Bought"]>0) ? 'storebtn' : 'unavailablebtn'
}

function condenseDimension(x) {
	if (!player.aarexModifications.ngp3c) return;
	if (player[TIER_NAMES[x]+"Bought"]<=0) return;
	let res = getOrSubResource(x)
	let cost = getCondenserCost(x)
	if (res.lt(cost)) return;
	getOrSubResource(x, cost)
	player.condensed.normal[x]++;
}

function maxCondense(x) {
	if (!player.aarexModifications.ngp3c) return;
	if (player[TIER_NAMES[x]+"Bought"]<=0) return;
	let res = getOrSubResource(x)
	let cost = getCondenserCost(x)
	if (res.lt(cost)) return;
	player.condensed.normal[x] = Math.max(player.condensed.normal[x], getCondenserTarget(x))
	getOrSubResource(x, cost)
}

function updateInfCondenser(x) {
	if (!player.aarexModifications.ngp3c) return;
	let cost = getInfCondenserCost(x)
	let resource = player.infinityPoints
	document.getElementById("infCndCont"+x).style.display = ""
	document.getElementById("infCnd"+x).textContent = (quantumed ? '' : "Condense: ")+shortenPreInfCosts(cost)
	document.getElementById("infCnd"+x).className = resource.gte(cost) ? 'storebtn' : 'unavailablebtn'
}

function getInfCondenserCostDiv() {
	let div = new Decimal(1)
	if (player.infinityUpgrades.includes("postinfi81")) div = div.times(getPostInfi81Mult())
	return div
}

function getInfCondenserCostScaling() {
	let scaling = 1
	if (player.eternityUpgrades.includes(12)) scaling *= 2/3 //0.67
	scaling *= 1-tmp.qcRewards[8] //0.02
	if (player.masterystudies.includes("d13")) scaling *= 1-getTreeUpgradeEffect(11)
	return scaling;
}

function getInfCondenserCost(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(1/0);
	let bought = player.condensed.inf[x]
	return Decimal.pow(Decimal.pow(CONDENSER_BASE[x], getInfCondenserCostScaling()), Decimal.pow(bought, 3.5)).times(Decimal.pow(CONDENSER_START[x], 2.5)).div(getInfCondenserCostDiv())
}

function getInfCondenserTarget(x) {
	if (!player.aarexModifications.ngp3c) return 0;
	let res = player.infinityPoints
	return Math.floor(Math.pow(res.times(getInfCondenserCostDiv()).div(Decimal.pow(CONDENSER_START[x], 2.5)).max(1).log10()/Decimal.log10(Decimal.pow(CONDENSER_BASE[x], getInfCondenserCostScaling())), 1/3.5)+1)
}

function getInfCondenserPow() {
	if (player.currentChallenge == "postcngc_1") return 0;
	
	let ret = new Decimal(1)
	if (player.challenges.includes("postcngc_1")) ret = ret.times(tmp.cnd?tmp.cnd.ic9:1)
	if (player.challenges.includes("postcngc_2")) ret = ret.times(1.15)
	if (player.timestudy.studies.includes(13)) ret = ret.times(ts13Eff())
	if (player.dilation.upgrades.includes("ngp3c2")) ret = ret.times(3)
	if (player.masterystudies.includes("t267")) ret = ret.times(1.5)
	if (hasBosonicUpg(53) && !tmp.qu.bigRip.active) ret = ret.times(2e4)
	return ret;
}

function getExtraInfConds() {
	let cond = 0
	if (player.timestudy.studies.includes(44)) cond+=3
	if (player.dilation.upgrades.includes("ngp3c2")) cond += getDil36Mult()
	if (player.masterystudies.includes("d13")) cond += getTreeUpgradeEffect(9);
	if (ghostified && player.ghostify.neutrinos.boosts >= 3) cond += tmp.nb[3];
	return cond
}

function getInfCondenserEff(x) {
	let res = inQC("8c")?player.infinityDimension1.amount:player.infinityPower
	return Decimal.pow(res.plus(1).log10()+1, Decimal.mul(player.condensed.inf[x]+tmp.cnd.extraInf, getInfCondenserPow()))
}

function condenseInfDim(x) {
	if (!player.aarexModifications.ngp3c) return;
	let res = player.infinityPoints
	let cost = getInfCondenserCost(x)
	if (res.lt(cost)) return;
	player.infinityPoints = player.infinityPoints.sub(cost)
	player.condensed.inf[x]++;
}

function maxInfCondense(x) {
	if (!player.aarexModifications.ngp3c) return;
	let res = player.infinityPoints
	let cost = getInfCondenserCost(x)
	if (res.lt(cost)) return;
	player.condensed.inf[x] = Math.max(player.condensed.inf[x], getInfCondenserTarget(x))
	player.infinityPoints = player.infinityPoints.sub(cost).max(0)
}

function getPostInfi70Mult() {
	let mult = Decimal.pow(1.02, Math.sqrt(player.resets))
	if (mult.gte(5e4)) mult = Decimal.mul(mult.log10()/Math.log10(5e4), 5e4)
	return mult;
}

function getPostInfi72Mult() {
	let totalInf = player.condensed.inf.reduce((a,c) => (a||0)+(c||0))
	if (totalInf>=21) totalInf = 20+Math.log10(totalInf)/Math.log10(21)
	let mult = Math.pow(totalInf, 1.5)/10+1
	return mult;
}

function getPostInfi80Mult() {
	let mult = Decimal.pow(player.infinityPower.plus(1).log10()+1, 2)
	if (player.infinityUpgrades.includes("postinfi82")) mult = mult.pow(Math.cbrt(mult.plus(1).log10()+1))
	return mult;
}

function getPostInfi81Mult() {
	let div = player.infinityPoints.plus(1).pow(.75)
	if (player.infinityUpgrades.includes("postinfi82")) div = div.pow(2.5)
	return div
}

document.getElementById("postinfi70").onclick = function() {
    buyInfinityUpgrade("postinfi70", 1e6);
}

document.getElementById("postinfi71").onclick = function() {
    buyInfinityUpgrade("postinfi71", 5e7);
}

document.getElementById("postinfi72").onclick = function() {
    buyInfinityUpgrade("postinfi72", 1e17);
}

document.getElementById("postinfi80").onclick = function() {
    buyInfinityUpgrade("postinfi80", 1e24);
}

document.getElementById("postinfi81").onclick = function() {
    buyInfinityUpgrade("postinfi81", 1e33);
}

document.getElementById("postinfi82").onclick = function() {
    buyInfinityUpgrade("postinfi82", 1e36);
}

function getReplCondenserCostSuperBase() {
	let base = 2
	if (player.eternityUpgrades.includes(12)) base -= .5
	base *= 1-tmp.qcRewards[8]/3
	return base;
}

function getReplCondenseCost() {
	let c = player.condensed.repl
	let cost = Decimal.pow(10, 2+Math.pow(getReplCondenserCostSuperBase(), c))
	return cost;
}

function getReplCondenseTarget() {
	if (player.replicanti.amount.lt(1e3)) return 0;
	let targ = Math.floor(Math.log10(player.replicanti.amount.log10()-2)/Math.log10(getReplCondenserCostSuperBase())+1)
	return targ;
}

function updateReplCond() {
	document.getElementById("replCond").textContent = getFullExpansion(player.condensed.repl)
	document.getElementById("replCond1").textContent = shorten(tmp.cnd?tmp.cnd.repl.eff1:1)
	document.getElementById("replCond2").textContent = shorten(tmp.cnd?tmp.cnd.repl.eff2:1)
	let cost = getReplCondenseCost()
	document.getElementById("replCondenseReq").textContent = shortenCosts(cost)
	document.getElementById("replCondense").className = player.replicanti.amount.gte(cost)?"storebtn":"unavailablebtn"
}

function replCondense(max=false) {
	if (!player.replicanti.unl) return
	if (!player.aarexModifications.ngp3c) return
	let cost = getReplCondenseCost()
	if (player.replicanti.amount.lt(cost)) return;
	if (max) player.condensed.repl = Math.max(player.condensed.repl, getReplCondenseTarget())
	else player.condensed.repl++;
	if (!max) player.replicanti.amount = new Decimal(1)
}

function getReplCondPow() {
	let pow = 1
	if (player.timestudy.studies.includes(21)) pow *= 1.4
	if (player.timestudy.studies.includes(33)) pow *= 1.1
	if (player.timestudy.studies.includes(43)) pow *= ts43Eff()
	if (player.dilation.upgrades.includes(8)) pow *= 1.15
	if (player.masterystudies.includes("t267")) pow *= 1.5
	if (ghostified && player.ghostify.neutrinos.boosts>3 && hasNU(10)) pow *= tmp.nb[4]
	if (tmp.be && !player.dilation.active && tmp.qu.breakEternity.upgrades.includes(8)) pow *= getBreakUpgMult(8)
	return pow;
}

function getIC9Eff() {
	let total = player.condensed.normal.reduce((a,c) => (a||0)+(c||0))
	if (total>=25) total = 24+Math.log10(total)/Math.log10(24)
	let mult = Math.log10(total+1)*2+1
	return mult;
}

function updateTimeCondenser(x) {
	if (!player.aarexModifications.ngp3c) return;
	let cost = getTimeCondenserCost(x)
	let resource = player.eternityPoints
	document.getElementById("timeCndCont"+x).style.display = ""
	document.getElementById("timeCnd"+x).textContent = (quantumed ? '' : "Condense: ")+shortenCosts(cost)
	document.getElementById("timeCnd"+x).className = resource.gte(cost) ? 'storebtn' : 'unavailablebtn'
}

function getTimeCondenserCostDiv() {
	let div = new Decimal(1)
	if (player.timestudy.studies.includes(203)) div = div.times(ts203Eff())
	return div
}

function getTimeCondenserCostScaling() {
	let scaling = 1
	if (player.eternityUpgrades.includes(12)) scaling *= 2/3
	scaling *= 1-tmp.qcRewards[8]
	return scaling;
}

function getTimeCondenserCost(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(1/0);
	let bought = player.condensed.time[x]
	return Decimal.pow(Decimal.pow(CONDENSER_BASE[x], getTimeCondenserCostScaling()), Decimal.pow(bought, 4)).times(Decimal.div(CONDENSER_START[x], 10)).div(getTimeCondenserCostDiv())
}

function getTimeCondenserTarget(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(0);
	let res = player.eternityPoints
	return Math.floor(Math.pow(res.times(getTimeCondenserCostDiv()).div(Decimal.div(CONDENSER_START[x], 10)).max(1).log10()/Decimal.log10(Decimal.pow(CONDENSER_BASE[x], getTimeCondenserCostScaling())), 1/4)+1)
}

function getTimeCondenserPow() {
	let ret = new Decimal(1)
	if (player.timestudy.studies.includes(195)) ret = ret.times(50)
	if (player.dilation.upgrades.includes("ngp3c1")) ret = ret.times(getDil26Mult())
	if (player.masterystudies.includes("t267")) ret = ret.times(1.5)
	if (tmp.ngp3c && tmp.be && tmp.qu.breakEternity.upgrades.includes(1)) ret = ret.times(getBreakUpgMult(1))
	if (tmp.qu.bigRip.upgrades.includes(13) && tmp.qu.bigRip.active) ret = ret.times(1.5)
	return ret;
}

function getFreeTimeConds() {
	let cond = 0
	if (player.dilation.upgrades.includes("ngp3c2")) cond += getDil36Mult()
	if (player.dilation.upgrades.includes("ngpp4")) cond++;
	if (player.masterystudies.includes("d13")) cond += getTreeUpgradeEffect(9);
	if (ghostified && player.ghostify.neutrinos.boosts >= 3) cond += tmp.nb[3];
	return cond;
}

function getTimeCondenserEff(x) {
	let res = inQC("8c")?player.timeDimension1.amount:player.timeShards
	return Decimal.pow(res.plus(1).log10()+1, Decimal.mul(player.condensed.time[x]+getFreeTimeConds(), getTimeCondenserPow()))
}

function condenseTimeDim(x) {
	if (!player.aarexModifications.ngp3c) return;
	let res = player.eternityPoints
	let cost = getTimeCondenserCost(x)
	if (res.lt(cost)) return;
	player.eternityPoints = player.eternityPoints.sub(cost)
	player.condensed.time[x]++;
}

function maxTimeCondense(x) {
	if (!player.aarexModifications.ngp3c) return;
	let res = player.eternityPoints
	let cost = getTimeCondenserCost(x)
	if (res.lt(cost)) return;
	player.condensed.time[x] = Math.max(player.condensed.time[x], getTimeCondenserTarget(x))
	player.eternityPoints = player.eternityPoints.sub(cost)
}

function ts13Eff() {
	let g = player.galaxies;
	if (tmp.be && (tmp.ngp3c?!player.dilation.active:player.dilation.active) && tmp.qu.breakEternity.upgrades.includes(10)) g *= getBreakUpgMult(10)
	let eff = Math.pow(g+1, 4/9);
	return eff;
}

function ts25Eff() {
	let eff = Decimal.pow(player.infinityPower.plus(1).log10()+1, 10);
	if (player.timestudy.studies.includes(197)) eff = eff.pow(3)
	if (player.dilation.upgrades.includes("ngp3c3")) eff = eff.pow(getDil46Mult())
	return eff;
}

function ts35Eff() {
	let ip = player.infinityPoints;
	let reached = false;
	if (ip.gte("1e9000")) reached = true;
	ip = ip.div("1e9500")
	let eff = Decimal.pow(ip.plus(1).log10()/100+1, 4).max(10)
	if (reached && ip.lt(1)) eff = new Decimal(10)
	return eff;
}

function ts43Eff() {
	let eff = player.replicanti.galaxies*0.02
	if (player.timestudy.studies.includes(197)) eff *= 3
	return eff+1
}

function ts52Eff() {
	let eff = Math.sqrt(player.replicanti.galaxies/2)
	if (player.timestudy.studies.includes(172)) eff *= Math.cbrt(player.replicanti.galaxies/10+1)
	return eff+1;
}

function ts63Eff() {
	let eff = Decimal.pow(player.eternityPoints.plus(1), 100)
	if (eff.gte("1e1000")) eff = Decimal.pow(eff.log10(), 1000/3)
	return eff;
}

function ts152Eff() {
	let eff = Decimal.pow(10, Math.sqrt(player.galaxies*5))
	return eff;
}

function ts172Eff() {
	let repl = player.replicanti.amount
	if (player.timestudy.studies.includes(197)) repl = repl.pow(Math.sqrt(player.replicanti.galaxies/2.5+1))
	else if (repl.gte("1e4000")) repl = Decimal.pow(repl.log10(), 1110.49).min(repl);
	let eff = repl.plus(1).pow(1e-3);
	if (eff.gte(1e285)) eff = new Decimal(eff.log10()).times(Decimal.div(1e285, 285))
	return eff;
}

function ts191Eff() {
	let inf = getInfinitied()
	let eff = Decimal.add(inf, 1).log10()/5
	return eff;
}

function ts202Eff() {
	let cond = player.condensed.normal.reduce((a,c) => (a||0)+(c||0));
	let eff = Decimal.pow("1e25000", Math.sqrt(cond))
	return eff;
}

function ts203Eff() {
	let cond = player.condensed.time.reduce((a,c) => (a||0)+(c||0));
	let eff = Decimal.pow(1e50, Math.sqrt(cond))
	if (!player.dilation.active && tmp.qu.bigRip.upgrades.includes(14) && tmp.qu.bigRip.active) eff = eff.pow(tmp.bru[14])
	return eff;
}

const OBSCUREMENTS = {
	nd: {
		title: "Normal Dimension Multipliers",
		scID: "NDs",
		osID: "ND",
		res() { return getDimensionFinalMultiplier(1) },
	},
	mptd: {
		title: "Mult per 10 Normal Dimensions",
		scID: "MPTD",
		osID: "MPTD",
		res() { return getDimensionPowerMultiplier() },
	},
	ts: {
		title: "Tickspeed",
		scID: "TS",
		osID: "TS",
		res() { return getTickspeed().pow(-1) },
	},
	sac: {
		title: "Sacrifice Multiplier",
		scID: "SAC",
		osID: "SAC",
		res() { return calcTotalSacrificeBoost() },
	},
	ip: {
		title: "IP Gain",
		scID: "IP",
		osID: "IP",
		res() { return gainedInfinityPoints() },
	},
	id: {
		title: "Infinity Dimension Multipliers",
		scID: "IDs",
		osID: "ID",
		res() { return DimensionPower(1) },
	},
	ep: {
		title: "EP Gain",
		scID: "EP",
		osID: "EP",
		res() { return gainedEternityPoints() },
	},
	td: {
		title: "Time Dimension Multipliers",
		scID: "TDs",
		osID: "TD",
		res() { return getTimeDimensionPower(1) },
	},
	ec13: {
		title: "EC13's Second Effect",
		scID: "EC13",
		osID: "EC13",
		res() { return getECReward(13, true) },
	},
	dt: {
		title: "Dilated Time Gain",
		scID: "DT",
		osID: "DT",
		res() { return getDilTimeGainPerSecond() },
	},
	tp: {
		title: "Tachyon Particle Gain",
		scID: "TP",
		osID: "TP",
		res() { return player.dilation.totalTachyonParticles },
	},
	md: {
		title: "Meta Dimension Multipliers",
		scID: "MDs",
		osID: "MD",
		res() { return getMetaDimensionMultiplier(1) },
	},
	ts263: {
		title: "TS263",
		scID: "TS263",
		osID: "TS263",
		res() { return getMTSMult(263) },
	},
	ts273: {
		title: "TS273",
		scID: "TS273",
		osID: "TS273",
		res() { return getMTSMult(273) },
	},
	qk: {
		title: "Quark Gain",
		scID: "QK",
		osID: "QK",
		res() { return getQuarkGain() },
	},
	fbpe: {
		title: "First Blue Power Effect",
		scID: "FBPE",
		osID: "FBPE",
		res() { return colorBoosts.b },
	},
	ghp: {
		title: "Ghost Particle Gain",
		scID: "GHP",
		osID: "GHP",
		res() { return getGHPGain() }
	},
}

function updateObscurements() {
	let html = ""
	for (let i=0;i<Object.keys(OBSCUREMENTS).length;i++) {
		let data = OBSCUREMENTS[Object.keys(OBSCUREMENTS)[i]]
		let scData = Object.values(softcap_data["ngp3c"+data.scID])
		let res = new Decimal(data.res())
		let obscuredEffect = {}
		if (!player.condensed.obsc[data.osID]) {
			if (res.gte((typeof scData[0].start == "function") ? scData[0].start() : scData[0].start) && (data.unl?data.unl():true)) player.condensed.obsc[data.osID] = []
			else continue;
		}
		html += "<h3>"+data.title+"</h3><br><ul style='list-style-type: none;'>"
		for (let j=0;j<scData.length;j++) {
			if (j==0 && data.scID=="NDs" && hasNU(6)) continue;
			let newData = scData[j]
			let start = (typeof newData.start == "function") ? newData.start() : newData.start
			if (!player.condensed.obsc[data.osID].includes(j+1)) {
				if (res.gte(start)) player.condensed.obsc[data.osID].push(j+1)
				else continue;
			}
			html += "<li>OS_"+data.osID+"_"+(j+1)+": Starts at "+shorten(start)
			let p = (typeof newData.pow == "function") ? newData.pow() : newData.pow;
			if (newData.func=="pow") html += ", ^"+shorten(p)
			else if (newData.func=="expPow") html += ", exponent ^"+shorten(p)
			else if (newData.func=="log") html += ", logged ^"+shorten(p)
			html += "</li>"
			obscuredEffect[newData.func] = Decimal.mul(obscuredEffect[newData.func]||1, p);
		}
		if (scData.length > 0) {
			html += "<br><li>Overall: "
			let i2 = 0;
			for (let x in obscuredEffect) {
				if (i2!=0) html += ", "
				let s = obscuredEffect[x].lt(0.01)?("(1 / "+shorten(obscuredEffect[x].pow(-1))+")"):shorten(obscuredEffect[x]);
				html += (x=="expPow"?"exponent ":(x=="log"?"logged ":""))+"^"+s
				i2++;
			}
			html += "</li>"
		}
		html += "</ul><br><br>"
	}
	if (html=="") html+="Oh hey there's nothing here yet... you need to make more progress first, so check in later!"
	document.getElementById("obscurements").innerHTML = html;
}

function getDil26Mult() {
	let mult = Math.pow(10, Math.pow(Math.log10(player.dilation.tachyonParticles.plus(1).log10()/5+1)+1, 1/4)-1)
	return mult;
}

function getDil36Mult() {
	let mult = Math.pow(player.dilation.dilatedTime.plus(1).log10()+1, 1/5)*5
	return mult;
}

function getDil46Mult() {
	let mult = Math.pow(Math.log10(player.dilation.dilatedTime.plus(1).log10()+1)+1, 2);
	return mult;
}

function getDil56Mult() {
	let mult = Decimal.pow(10, Math.sqrt(player.meta.antimatter.plus(1).log10())*1e4)
	return mult;
}

function getDil83Mult() {
	let mult = Decimal.pow(player.eternityPoints.plus(1).log10()+1, 0.75);
	return mult;
}

function getDil85Mult() {
	let tp = player.dilation.tachyonParticles
	if (tp.gte(Number.MAX_VALUE)) tp = tp.sqrt().times(Decimal.sqrt(Number.MAX_VALUE))
	let mult = Math.pow(tp.plus(1).log10()+1, 0.165)
	return mult;
}

function updateMetaCondenser(x) {
	if (!player.aarexModifications.ngp3c) return;
	let cost = getMetaCondenserCost(x)
	let resource = player.meta.antimatter
	document.getElementById("metaCndCont"+x).style.display = ""
	document.getElementById("metaCnd"+x).textContent = (quantumed ? '' : "Condense: ")+shortenCosts(cost)
	document.getElementById("metaCnd"+x).className = resource.gte(cost) ? 'storebtn' : 'unavailablebtn'
}

function getMetaCondenserCostDiv() {
	let div = new Decimal(1)
	return div
}

function getMetaCondenserCostScaling() {
	let scaling = 1
	scaling *= 1-tmp.qcRewards[8]
	return scaling;
}

function getMetaCondenserCost(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(1/0);
	let bought = player.condensed.meta[x]
	return Decimal.pow(Decimal.pow(CONDENSER_BASE[x], getMetaCondenserCostScaling()), Decimal.pow(bought, 4)).times(CONDENSER_START[x]).div(getMetaCondenserCostDiv())
}

function getMetaCondenserTarget(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(0);
	let res = player.meta.antimatter
	return Math.floor(Math.pow(res.times(getMetaCondenserCostDiv()).div(CONDENSER_START[x]).max(1).log10()/Decimal.log10(Decimal.pow(CONDENSER_BASE[x], getMetaCondenserCostScaling())), 1/4)+1)
}

function getMetaCondenserPow() {
	let ret = new Decimal(1)
	if (player.masterystudies.includes("t267")) ret = ret.times(1.5)
	ret = ret.times(getECReward(14, true))
	if (inQC("8c")) ret = ret.times(2.15)
	if (tmp.twr) if (tmp.twr.gte(9)) ret = ret.times(1.1)
	return ret;
}

function getFreeMetaConds() {
	let cond = 0
	if (player.dilation.upgrades.includes("ngpp4")) cond++;
	if (player.masterystudies.includes("d13")) cond += getTreeUpgradeEffect(9);
	if (ghostified && player.ghostify.neutrinos.boosts >= 3) cond += tmp.nb[3];
	return cond;
}

function getMetaCondenserEff(x) {
	return Decimal.pow(player.meta.antimatter.plus(1).log10()+1, Decimal.mul(player.condensed.meta[x]+getFreeMetaConds(), getMetaCondenserPow()))
}

function condenseMetaDim(x) {
	if (!player.aarexModifications.ngp3c) return;
	if (player.meta[x].bought<=0) return;
	let res = player.meta.antimatter
	let cost = getMetaCondenserCost(x)
	if (res.lt(cost)) return;
	if (!player.achievements.includes("ng3p72")) player.meta.antimatter = player.meta.antimatter.sub(cost)
	player.condensed.meta[x]++;
}

function maxMetaCondense(x) {
	if (!player.aarexModifications.ngp3c) return;
	if (player.meta[x].bought<=0) return;
	let res = player.meta.antimatter
	let cost = getMetaCondenserCost(x)
	if (res.lt(cost)) return;
	player.condensed.meta[x] = Math.max(player.condensed.meta[x], getMetaCondenserTarget(x))
	if (!player.achievements.includes("ng3p72")) player.meta.antimatter = player.meta.antimatter.sub(cost)
}

function isIC10Trapped() {
	return (player.currentEternityChall == "eterc13" || inQC("8c")) && player.aarexModifications.ngp3c
}

function updateElecCond() {
	document.getElementById("elecCond").textContent = getFullExpansion(player.condensed.elec)
	document.getElementById("elecCondEff").textContent = getFullExpansion(tmp.cnd?Math.round(tmp.cnd.elec.eff*100)/100:1)
	let cost = getElecCondenseCost()
	document.getElementById("elecCondenseReq").textContent = getFullExpansion(cost)
	document.getElementById("elecCondense").className = "gluonupgrade "+((tmp.qu.electrons.amount>=cost)?"storebtn":"unavailablebtn")
}

function getElecCondenseCost() {
	let lvl = player.condensed.elec;
	if (lvl>=15) lvl = Math.pow(lvl, Math.pow(Math.log(lvl)/Math.log(15), 3))
	if (lvl>=3) lvl = Math.pow(lvl, Math.log(lvl)/Math.log(3))
	return Math.floor(3000*Math.pow(lvl+1, 0.3))
}

function getElecCondenseTarget() {
	let t = Math.pow(tmp.qu.electrons.amount/3000, 10/3)-1;
	if (t>=3) t = Math.pow(Math.E, Math.sqrt(Math.log(3)*Math.log(t)))
	if (t>=15) t = Math.pow(Math.E, 2.11102090079*Math.pow(Math.log(t), 1/4))
	return Math.max(Math.floor(t+1), 0);
}

function elecCondense(max=false) {
	if (!player.masterystudies.includes("d7")) return
	if (!player.aarexModifications.ngp3c) return
	let cost = getElecCondenseCost()
	if (tmp.qu.electrons.amount<cost) return;
	if (max) player.condensed.elec = Math.max(player.condensed.elec, getElecCondenseTarget())
	else player.condensed.elec++;
	if (!max) tmp.qu.electrons.amount -= cost;
}

function getElecCondPow() {
	let pow = 1;
	if (ghostified && player.ghostify.neutrinos.boosts>3) pow *= tmp.nb[4]
	return pow;
}

function getElecCondEff() {
	let e = tmp.qu.electrons.amount;
	let c = player.condensed.elec * getElecCondPow();
	if (c<=2) return Math.pow(Math.log(e+1)/Math.log(2)+1, c)
	else return Math.pow(Math.log(e+1)/Math.log(2)+1, 2)*Math.sqrt(c-1)
}

function getCondPreonEff() {
	let mult = getCondPreonEffMult();
	let preons = player.quantum.replicants.quarks;
	if (preons.gte(1e10)) return Math.sqrt(preons.plus(1).log10()/Math.log10(2))*1.8/Math.log10(2) * mult
	return preons.plus(1).log10()/Math.log10(2) * mult
}

function getCondPreonEffMult() {
	let mult = 5;
	if (player.masterystudies.includes("t345")) mult *= getMTSMult(345)
	if (hasNU(12) && tmp.qu.bigRip.active) mult *= tmp.nu[4].inf;
	if (hasBosonicUpg(14)) mult *= tmp.blu[14]
	if (player.ghostify.hb.unl && tmp.hm.preons && player.ghostify.hb.masses.preons) mult *= tmp.hm.preons.eff
	return mult;
}

const EMP_CONDENSER_START = {
	1: 1e3,
	2: 1e5,
	3: 1e8,
	4: 1e12,
	5: 1e17,
	6: 1e23,
	7: 1e30,
	8: 1e40,
}

const EMP_CONDENSER_BASE = {
	1: 10,
	2: 25,
	3: 100,
	4: 1e4,
	5: 1e7,
	6: 1e9,
	7: 1e12,
	8: 1e15,
}

function getEmpCondenserCostScaling() {
	let s = 1
	return s
}

function getEmpCondenserCostDiv() {
	let div = new Decimal(1)
	return div;
}

function getEmpCondenserCost(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(1/0);
	let bought = player.condensed.emp[x]
	return Decimal.pow(EMP_CONDENSER_BASE[x], Decimal.pow(bought, 1+1.5**getEmpCondenserCostScaling())).times(EMP_CONDENSER_START[x]).div(getEmpCondenserCostDiv())
}

function getEmpCondenserTarget(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(0);
	let res = tmp.qu.replicants.amount;
	let target = Math.pow(res.times(getEmpCondenserCostDiv()).div(EMP_CONDENSER_START[x]).max(1).log10()/Math.log10(EMP_CONDENSER_BASE[x]), 1/(1+1.5**getEmpCondenserCostScaling()))
	return Math.floor(target+1)
}

function getEmpCondenserPow() {
	let pow = new Decimal(1)
	if (player.ghostify.milestones>=8) pow = pow.times(1.25);
	return pow
}

function getEmpCondenserEff(x) {
	return Decimal.pow(tmp.qu.replicants.amount.plus(1).log10()+1, Decimal.mul(player.condensed.emp[x], getEmpCondenserPow()))
}

function updateEmpCondenser(x) {
	document.getElementById("empCondenseDiv"+x).style.display = tmp.ngp3c ? "" : "none"
	if (!player.aarexModifications.ngp3c) return;
	let costPart = ghostified ? '' : 'Condense: '
	let cost = getEmpCondenserCost(x)
	let resource = tmp.qu.replicants.amount;
	document.getElementById("empCondense"+x).textContent = costPart + shorten(cost) + " Replicants"
	document.getElementById("empCondense"+x).className = (resource.gte(cost)&&tmp.eds[x].perm>0) ? 'storebtn' : 'unavailablebtn'
}

function condenseEmpDimension(x) {
	if (!player.aarexModifications.ngp3c) return;
	if (tmp.eds[x].perm<=0) return;
	let res = tmp.qu.replicants.amount;
	let cost = getEmpCondenserCost(x)
	if (res.lt(cost)) return;
	tmp.qu.replicants.amount = tmp.qu.replicants.amount.sub(cost);
	player.condensed.emp[x]++;
	updateReplicants();
}

function maxEmpCondense(x) {
	if (!player.aarexModifications.ngp3c) return;
	if (tmp.eds[x].perm<=0) return;
	let res = tmp.qu.replicants.amount;
	let cost = getEmpCondenserCost(x)
	if (res.lt(cost)) return;
	player.condensed.emp[x] = Math.max(player.condensed.emp[x], getEmpCondenserTarget(x))
	tmp.qu.replicants.amount = tmp.qu.replicants.amount.sub(cost);
}

const NANO_CONDENSER_START = {
	1: 80,
	2: 5e3,
	3: 1e5,
	4: 4e6,
	5: 2e8,
	6: 5e9,
	7: 1e11,
	8: 2.5e11,
}

const NANO_CONDENSER_BASE = {
	1: 5,
	2: 25,
	3: 125,
	4: 3125,
	5: 78125,
	6: 390625,
	7: 9765625,
	8: 244140625,
}

function getNanoCondenserCostScaling() {
	let s = 1
	if (player.achievements.includes("ng3p66")) s -= 0.25;
	return s
}

function getNanoCondenserCostDiv() {
	let div = new Decimal(1)
	return div;
}

function getNanoCondenserCost(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(1/0);
	let bought = player.condensed.nano[x]
	return Decimal.pow(NANO_CONDENSER_BASE[x], Decimal.pow(bought, 1+2**getNanoCondenserCostScaling())).times(NANO_CONDENSER_START[x]).div(getNanoCondenserCostDiv())
}

function getNanoCondenserTarget(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(0);
	let res = tmp.qu.nanofield.energy;
	let target = Math.pow(res.times(getNanoCondenserCostDiv()).div(NANO_CONDENSER_START[x]).max(1).log10()/Math.log10(NANO_CONDENSER_BASE[x]), 1/(1+2**getNanoCondenserCostScaling()))
	return Math.floor(target+1)
}

function getNanoCondenserPow() {
	let pow = new Decimal(1)
	if (isBigRipUpgradeActive(20)) pow = pow.times(1.1);
	return pow
}

function getNanoCondenserEff(x) {
	return Decimal.pow(tmp.qu.nanofield.energy.plus(1).log10()+1, Decimal.mul(player.condensed.nano[x], getNanoCondenserPow())).max(1).log10()
}

function updateNanoCondenser(x) {
	document.getElementById("nfCond"+x).style.display = tmp.ngp3c ? "" : "none"
	if (!player.aarexModifications.ngp3c) return;
	let costPart = ghostified ? '' : 'Condense: '
	let endPart = ' Preon Energy'
	let cost = getNanoCondenserCost(x)
	let resource = tmp.qu.nanofield.energy;
	document.getElementById("nfCond"+x).textContent = costPart + shorten(cost) + endPart
	document.getElementById("nfCond"+x).className = (resource.gte(cost)&&tmp.qu.nanofield.rewards>=x) ? 'nfCond' : 'nfCondlocked'
}

function condenseNanoReward(x) {
	if (!player.aarexModifications.ngp3c) return;
	if (tmp.qu.nanofield.rewards<x) return;
	let res = tmp.qu.nanofield.energy;
	let cost = getNanoCondenserCost(x)
	if (res.lt(cost)) return;
	tmp.qu.nanofield.energy = tmp.qu.nanofield.energy.sub(cost);
	player.condensed.nano[x]++;
}

function maxNanoCondense(x) {
	if (!player.aarexModifications.ngp3c) return;
	if (tmp.qu.nanofield.rewards<x) return;
	let res = tmp.qu.nanofield.energy;
	let cost = getNanoCondenserCost(x)
	if (res.lt(cost)) return;
	player.condensed.nano[x] = Math.max(player.condensed.nano[x], getNanoCondenserTarget(x))
	tmp.qu.nanofield.energy = tmp.qu.nanofield.energy.sub(cost);
}

function maxNanoCondenseAll() {
	if (!tmp.ngp3c) return;
	for (let i=1;i<=8;i++) maxNanoCondense(i);
}

const NGP3C_BR_COST = 1.65e5;
const NGP3C_BR_GOAL = Decimal.pow(10, 504693932.039);
const NGP3C_BE_REQ = new Decimal("1e8300");

function getBreakEternityTimeshardRoot() {
	let rt = 35;
	if (tmp.ngp3c && tmp.qu.breakEternity.upgrades.includes(4)) rt = Math.pow(rt, 0.95-0.1*tmp.qu.breakEternity.upgrades.filter(x => x>=4&&x<=6).length);
	return rt;
}

function getBE7Base() {
	let base = new Decimal(1e9);
	if (tmp.qu.breakEternity.upgrades.includes(5) && tmp.ngp3c && tmp.be) base = base.times(getBreakUpgMult(5));
	return base;
}

const LIGHT_CONDENSER_START = {
	1: 1e4,
	2: 7.5e4,
	3: 1e6,
	4: 2.5e6,
	5: 1e7,
	6: 4.75e7,
	7: 3.6e8,
	8: 4e10,
}

const LIGHT_CONDENSER_BASE = {
	1: 1.5,
	2: 2.5,
	3: 4,
	4: 6,
	5: 9,
	6: 13,
	7: 17,
	8: 3.5,
}

function updateLightCondenser(x) {
	document.getElementById("light"+x+"condenseDiv").style.display = tmp.ngp3c ? "" : "none"
	if (!player.aarexModifications.ngp3c) return;
	let costPart = 'Condense: '
	let cost = getLightCondenserCost(x)
	let resource = player.ghostify.ghostlyPhotons.ghostlyRays;
	document.getElementById("light"+x+"condense").textContent = costPart + shorten(cost)+" Ghostly Rays"
	document.getElementById("light"+x+"condense").className = "gluonupgrade "+(resource.gte(cost) ? 'gph' : 'unavailablebtn')
}

function getLightCondenserCost(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(1/0);
	let bought = player.condensed.light[x]
	return Decimal.pow(LIGHT_CONDENSER_BASE[x], Decimal.pow(bought, 1+2**getLightCondenserCostScaling())).times(LIGHT_CONDENSER_START[x])
}

function getLightCondenserTarget(x) {
	if (!player.aarexModifications.ngp3c) return new Decimal(0);
	let res = player.ghostify.ghostlyPhotons.ghostlyRays;
	let target = Math.pow(res.div(LIGHT_CONDENSER_START[x]).max(1).log10()/Math.log10(LIGHT_CONDENSER_BASE[x]), 1/(1+2**getLightCondenserCostScaling()))
	return Math.floor(target+1)
}

function getLightCondenserCostScaling() {
	return 1;
}

function condenseLight(x) {
	if (!player.aarexModifications.ngp3c) return;
	let res = player.ghostify.ghostlyPhotons.ghostlyRays;
	let cost = getLightCondenserCost(x)
	if (res.lt(cost)) return;
	player.ghostify.ghostlyPhotons.ghostlyRays = player.ghostify.ghostlyPhotons.ghostlyRays.sub(cost);
	player.condensed.light[x]++;
}

function maxCondenseLight(x) {
	if (!player.aarexModifications.ngp3c) return;
	let res = player.ghostify.ghostlyPhotons.ghostlyRays;
	let cost = getLightCondenserCost(x)
	if (res.lt(cost)) return;
	player.condensed.light[x] = Math.max(player.condensed.light[x], getLightCondenserTarget(x))
	player.ghostify.ghostlyPhotons.ghostlyRays = player.ghostify.ghostlyPhotons.ghostlyRays.sub(cost);
}

function getLightCondenserPow() {
	let pow = 1;
	if (hasBosonicUpg(25)) pow *= tmp.blu[25]
	if (isLEBoostUnlocked(10)) pow *= tmp.leBonus[10]
	return pow;
}

function getLightCondenserEff(x) {
	let amt = player.condensed.light[x] * ((tmp.cnd?tmp.cnd.lightPow:1)||1);
	let eff = Decimal.add(player.ghostify.ghostlyPhotons.ghostlyRays.plus(1).log10() * amt, 1).log10()*amt+1;
	if (eff>=5) eff = Math.sqrt(eff*5);
	return eff;
}

function getBENTotalLevelEffect() {
	let eff = Math.log2(tmp.bEn.totalLvl.plus(1).log10()+1);
	if (player.ghostify.bl.upgrades.length>6) return Math.max(Decimal.log2(tmp.bEn.totalLvl.plus(1).cbrt()), eff) * getBENTotalLevelEffectMult();
	else return eff * getBENTotalLevelEffectMult()
}

function getBENTotalLevelEffectMult() {
	let mult = 1
	if (player.ghostify.bl.usedEnchants.includes(25)) mult = mult *= (tmp.bEn[25] || 1);
	return mult;
}

var display_scalings_data = [
	{
		id: "dimBoost",
		name: "Dimension Boosts",
		amt() { return player.resets },
		scalings: [
			{
				id: "ss",
				name: "Dimension Supersonic Scaling",
				active() { return true },
				start() { return getSupersonicStart() },
				power(s) { return getSupersonicMultIncrease() },
				disp(p,s) {
					let int = getSupersonicInterval(); 
					return "Increases Dimension Boost cost multiplier by "+getFullExpansion(Math.round(p))+" per "+getFullExpansion(Math.round(int))+" Dimension Boosts (Total: +"+shorten(p*((player.resets-s)/int))+"x)" 
				},
			},
		],
	},
	{
		id: "galaxies",
		name: "Galaxies",
		amt() { return player.galaxies },
		scalings: [
			{
				id: "distant",
				name: "Distant Galaxies",
				active() { return true },
				start() { return getDistantScalingStart() },
				power(s) { return getDistantAdd((tmp.grd.galaxies||0)-s+1)*getDistantSpeed(tmp.grd.speed||1) },
				disp(p,s) { return "Increases the Galaxy requirement by "+getFullExpansion(Math.round(p))+" Eighth Dimensions" },
			},
			{
				id: "further",
				name: "Further Galaxies",
				active() { return player.galacticSacrifice != undefined },
				start() { return getDistantScalingStart()*2.5 },
				power(s) { return getDistantAdd((tmp.grd.galaxies||0)-s+1)*getDistantSpeed(tmp.grd.speed||1)*4 },
				disp(p,s) { return "Increases the Galaxy requirement by "+getFullExpansion(Math.round(p))+" Eighth Dimensions" },
			},
			{
				id: "remote",
				name: "Remote Galaxies",
				active() { return !tmp.be && !(hasNU(6) && !tmp.ngp3c) },
				start() { return getRemoteScalingStart() },
				power(s) { return Math.pow(1 + (GUBought("rg1") ? 1 : 2) / (player.aarexModifications.ngmX > 3 ? 10 : 1e3), ((tmp.grd.galaxies||0) - s + 1) * getRemoteSpeed(tmp.grd.speed||1)) },
				disp(p,s) { return "Multiplies the Galaxy requirement by "+getFullExpansion(Math.round(p*100)/100) },
			},
			{
				id: "darkMatter",
				name: "Dark Matter Galaxies",
				active() { return true },
				start() { return tmp.grd.darkStart||(1/0) },
				power(s) { return getDarkMatterGalaxyPush(tmp.grd.speed||1) },
				disp(p,s) { return "Makes Distant Galaxy scaling start "+getFullExpansion(Math.ceil(((tmp.grd.galaxies||0) - tmp.grd.darkStart + 1) / p))+" sooner" },
			},
			{
				id: "ghostly",
				name: "Ghostly Galaxies",
				active() { return true },
				start() { return getGhostlyGalaxyScalingStart() / (tmp.be ? 55 : 1) },
				power(s) { return tmp.grd.speed },
				disp(p,s) { return "Speeds up all previous Galaxy scalings by "+shorten(p)+"x" },
			},
			{
				id: "cosmic",
				name: "Cosmic Galaxies",
				active() { return true },
				start() { return (getGhostlyGalaxyScalingStart() / (tmp.be ? 55 : 1))*3 },
				power(s) { 
					let over = (tmp.grd.galaxies||0) / (s / (tmp.be ? 55 : 1))
					return Math.pow(over, 6) / 729 
				},
				disp(p,s) { return "Speeds up Ghostly Galaxy scaling by "+shorten(p)+"x" },
			},
		],
	},
	{
		id: "replGal",
		name: "Replicated Galaxies",
		amt() { return player.replicanti.gal },
		scalings: [
			{
				id: "distant",
				name: "Distant Replicated Galaxies",
				active() { return true },
				start() { return getDistantRGStart() },
				power(s) { return (1 - Math.max((s-2) - player.replicanti.gal, 0)) * (15e6/s * (1 - Math.max((s-2) - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, s-2) * 2) - 29935e3) },
				disp(p,s) { return "Multiplies Replicated Galaxy cost by "+shorten(Decimal.pow(10, p))+" per RG (Total: "+shorten(Decimal.pow(10, p*(player.replicanti.gal-s)))+"x)" },
			},
			{
				id: "further",
				name: "Further Replicated Galaxies",
				active() { return true },
				start() { return 58200 },
				power(s) { return (1 - Math.max((s-1) - player.replicanti.gal, 0)) * (1e6 * (1 - Math.max((s-1) - player.replicanti.gal, 0) + Math.max(player.replicanti.gal, (s-1)) * 2) - (s-1)*1e6) },
				disp(p,s) { return "Multiplies Replicated Galaxy cost by "+shorten(Decimal.pow(10, p))+" per RG (Total: "+shorten(Decimal.pow(10, p*(player.replicanti.gal-s)))+"x)" },
			},
		],
	},
	{
		id: "intergalactic",
		name: "Intergalactic Boost",
		amt() { return tmp.ig },
		decimal: true,
		scalings: [
			{
				id: "distant",
				name: "Distant Intergalactic Boost",
				active() { return player.quantum.bigRip.active },
				start() { return Decimal.pow(10, 1e9) },
				power(s) { return .75 },
				disp(p) { return "Raises Intergalactic Boost's exponent ^"+shorten(p) },
			},
			{
				id: "further",
				name: "Further Intergalactic Boost",
				active() { return true },
				start() { return Decimal.pow(10, tmp.qu.bigRip.active?1e11:4e18) },
				power(s) { return tmp.qu.bigRip.active?11:8.92195 },
				disp(p) { return "Logs Intergalactic Boost but "+(tmp.qu.bigRip.active?"":"multiplies its exponent by 6 and ")+"raises its exponent ^"+shorten(p) },
			},
			{
				id: "remote",
				name: "Remote Intergalactic Boost",
				active() { return player.aarexModifications.ngudpV },
				start() { return Decimal.pow(10, 7e18) },
				power(s) { return 9.36436 },
				disp(p) { return "Logs Intergalactic Boost but raises its exponent ^"+shorten(p) },
			},
			{
				id: "darkMatter",
				name: "Dark Matter Intergalactic Boost",
				active() { return true },
				start() { return Decimal.pow(10, 1e20) },
				power(s) { return softcap_data["ig_log_high"][1].pow },
				disp(p) { return "Logs Intergalactic Boost but multiplies its exponent by "+shorten(softcap_data["ig_log_high"][1].mul)+" and raises its exponent ^"+shorten(p) },
			},
			{
				id: "ghostly",
				name: "Ghostly Intergalactic Boost",
				active() { return true },
				start() { return Decimal.pow(10, 1e21) },
				power(s) { return softcap_data["ig_log_high"][2].pow },
				disp(p) { return "Raises Intergalactic Boost's exponent ^"+shorten(p) },
			},
			{
				id: "cosmic",
				name: "Cosmic Intergalactic Boost",
				active() { return true },
				start() { return Decimal.pow(10, 1e22) },
				power(s) { return softcap_data["ig_log_high"][3].pow },
				disp(p) {  return "Logs Intergalactic Boost but multiplies its exponent by "+shorten(softcap_data["ig_log_high"][3].mul)+" and raises its exponent ^"+shorten(p) },
			},
			{
				id: "ethereal",
				name: "Ethereal Intergalactic Boost",
				active() { return true },
				start() { return Decimal.pow(10, 1e23) },
				power(s) { return softcap_data["ig_log_high"][4].pow },
				disp(p) { return "Raises Intergalactic Boost's exponent ^"+shorten(p) },
			},
			{
				id: "annihilated",
				name: "Annihilated Intergalactic Boost",
				active() { return true },
				start() { return Decimal.pow(10, 1e24) },
				power(s) { return 10 },
				disp(p) { return "Logs Intergalactic Boost but raises its exponent ^"+shorten(p) },
			},
		],
	},
	{
		id: "nanoreward",
		name: "Nanofield Rewards",
		amt() { return tmp.qu.nanofield.rewards||0 },
		scalings: [
			{
				id: "distant",
				name: "Distant Nanofield Rewards",
				active() { return tmp.nf.scalings.active[1] },
				start() {
					let sub = tmp.nf.scalings.active[4]?(Math.pow(Math.max(tmp.qu.nanofield.rewards - tmp.nf.scalings.start[4], 0) * tmp.nf.scaleSpeed + 1, 2) * tmp.nf.scalings.bases[4]):0
					return tmp.nf.scalings.start[1] - sub 
				},
				power(s) { return Math.pow(tmp.nf.scalings.bases[1], tmp.nf.scaleSpeed*(tmp.ppti||1)) },
				disp(p,s) { return "Multiplies Preon Power requirement by "+shorten(p)+" per Preon Power^2 (Total: "+shorten(Decimal.pow(p, (tmp.qu.nanofield.rewards - s) * (tmp.qu.nanofield.rewards - s + 3)))+"x)" },
			},
			{
				id: "further",
				name: "Further Nanofield Rewards",
				active() { return tmp.nf.scalings.active[2] },
				start() { return tmp.nf.scalings.start[2] },
				power(s) { return Math.pow(tmp.nf.scalings.bases[2], tmp.nf.scaleSpeed*(tmp.ppti||1)) },
				disp(p,s) { return "Multiplies Preon Power requirement by "+shorten(p)+" per Preon Power^2 (Total: "+shorten(Decimal.pow(p, (tmp.qu.nanofield.rewards - s) * (tmp.qu.nanofield.rewards - s + 1)))+"x)" },
			},
			{
				id: "remote",
				name: "Remote Nanofield Rewards",
				active() { return tmp.nf.scalings.active[3] },
				start() { return tmp.nf.scalings.start[3] },
				power(s) { return Math.pow(tmp.nf.scalings.bases[3], tmp.nf.scaleSpeed*(tmp.ppti||1)) },
				disp(p,s) { return "Multiplies Preon Power requirement by "+shorten(p)+" per Preon Power^3 (Total: "+shorten(Decimal.pow(p, (tmp.qu.nanofield.rewards - s) * (tmp.qu.nanofield.rewards - s + 1) * (tmp.qu.nanofield.rewards - s + 2) / 3 + (tmp.qu.nanofield.rewards - s) * (tmp.qu.nanofield.rewards - s + 1) / 2 * 19))+"x)" },
			},
			{
				id: "darkMatter",
				name: "Dark Matter Nanofield Rewards",
				active() { return tmp.nf.scalings.active[4] },
				start() { return tmp.nf.scalings.start[4] },
				power(s) { return tmp.nf.scalings.bases[4] },
				disp(p,s) { return "Makes Distant Nanofield Reward scaling start "+getFullExpansion(Math.round(p*tmp.nf.scaleSpeed*10)/10)+" earlier per Preon Power^2 (Total: "+getFullExpansion(Math.round(Math.pow((tmp.qu.nanofield.rewards - s) * tmp.nf.scaleSpeed + 1, 2) * p * 10)/10)+" earlier)" },
			},
			{
				id: "ghostly",
				name: "Ghostly Nanofield Rewards",
				active() { return tmp.nf.scalings.active[5] },
				start() { return tmp.nf.scalings.start[5] },
				power(s) { return tmp.nf.scaleSpeed },
				disp(p) { return "Speeds up all previous Nanofield Reward scalings by "+shorten(p)+"x" },
			},
			{
				id: "cosmic",
				name: "Cosmic Nanofield Rewards",
				active() { return tmp.nf.scalings.active[6] },
				start() { return tmp.nf.scalings.start[6] },
				power(s) { return Math.pow(tmp.nf.scalings.bases[6], tmp.ppti||1) },
				disp(p) { return "Multiplies Preon Power requirement by "+shorten(p)+" per Preon Power^4" },
			},
		],
	},
	{
		id: "le",
		name: "Light Empowerments",
		amt() { return player.ghostify.ghostlyPhotons.enpowerments },
		scalings: [
			{
				id: "distant",
				name: "Distant Light Empowerments",
				active() { return true },
				start() { return tmp.leReqScaleStarts[1]||20 },
				power(s) { return Math.pow(player.ghostify.ghostlyPhotons.enpowerments - s + 1, 2) / 3 },
				disp(p) { return "Increases Light Empowerment requirement by "+getFullExpansion(Math.round(p)) },
			},
			{
				id: "further",
				name: "Further Light Empowerments",
				active() { return true },
				start() { return tmp.leReqScaleStarts[2]||50 },
				power(s) { return Math.pow(player.ghostify.ghostlyPhotons.enpowerments - s + 1, 2) * 5/3 },
				disp(p) { return "Increases Light Empowerment requirement by "+getFullExpansion(Math.round(p)) },
			},
		]
	},
	{
		id: "hb",
		name: "Higgs Bosons",
		amt() { return tmp.hb?tmp.hb.higgs:0 },
		scalings: [
			{
				id: "distant",
				name: "Distant Higgs Bosons",
				active() { return true },
				start() { return getHiggsScalingData(1).start },
				power(s) { return getHiggsScalingData(1).exp },
				disp(p) { return "Increases the Higgs Boson requirement exponent by "+getFullExpansion(Math.round((p-1)*100)/100) },
			},
		]
	},
]

function updateScalingsDisplay() {
	document.getElementById("scalingStats").style.display = (tmp.ngp3c && (ghostified || quantumed || player.dilation.studies.includes(6))) ? "" : "none"
	if (document.getElementById("scalings").style.display=="none") return;
	for (let i=0;i<display_scalings_data.length;i++) {
		let data = display_scalings_data[i];
		let amt = data.amt();
		let shown = false
		for (let j=0;j<data.scalings.length;j++) {
			let data2 = data.scalings[j];
			let useDecimal = !(!data.decimal)
			if (data2.active()) {
				let start = data2.start();
				let power = data2.power(start);
				let shown2 = useDecimal?(Decimal.gte(amt, start) && Decimal.gt(power, 0)):(amt>=start && power>0);
				if (shown2) {
					document.getElementById(data.id+data2.id+"Start").textContent = useDecimal?shorten(start):getFullExpansion(Math.round(start));
					document.getElementById(data.id+data2.id+"Effect").textContent = data2.disp(power, start);
					shown = true;
				}
				document.getElementById(data.id+data2.id+"Scaling").style.display = shown2?"":"none"
			} else document.getElementById(data.id+data2.id+"Scaling").style.display = "none"
		}
		document.getElementById(data.id+"Scalings").style.display = shown?"":"none"
	}
}

function setupScalingsHTML() {
	let html = "<br>"
	for (let i=0;i<display_scalings_data.length;i++) {
		let data = display_scalings_data[i];
		html += "<div id='"+data.id+"Scalings'><h1 class='glowspan'>"+data.name+"</h1>"
		for (let j=0;j<data.scalings.length;j++) {
			let data2 = data.scalings[j];
			html += "<div id='"+data.id+data2.id+"Scaling'><h3 class='glowspan'>"+data2.name+"</h3>Start: <span id='"+data.id+data2.id+"Start'></span><br>Effect: <span id='"+data.id+data2.id+"Effect'></span><br><br><br></div>"
		}
		html += "</div><br><br>"
	}
	document.getElementById("scalings").innerHTML = html
}