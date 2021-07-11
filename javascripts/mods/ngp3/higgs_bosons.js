function setupHiggsSave() {
	let data = {
		unl: false,
		higgs: 0
	}
	if (player.aarexModifications.ngp3c) {
		data.masses = {};
		data.type = 0;
	}
	player.ghostify.hb = data
	tmp.hb = player.ghostify.hb
	return data
}

function unlockHiggs() {
	if (tmp.ngp3l) { // higgs isn't a thing in legacy mode
		return
	} 
	if (player.ghostify.hb.unl) return
	if (!player.ghostify.wzb.unl) return
	if (!canUnlockHiggs()) return
	$.notify("Congratulations! You have unlocked Higgs Bosons!", "success")
	player.ghostify.hb.unl = true
	updateHiggsUnlocks()
}

function canUnlockHiggs() {
	return player.money.gte(Decimal.pow(10, tmp.ngp3c?6.75e15:2e17)) && player.ghostify.bl.am.gte(getHiggsRequirement()) && !tmp.ngp3l
}

function updateHiggsUnlocks() {
	if (tmp.ngp3l) {
		document.getElementById("nextParticle").style.display = "none"
		document.getElementById("bosonicResets").style.display = "none"
		document.getElementById("higgstabbtn").style.display = "none"
		document.getElementById("hmRow").style.display = "none"
		return
	}
	let unl = player.ghostify.hb.unl
	document.getElementById("nextParticle").style.display = unl ? "none" : ""
	document.getElementById("bosonicResets").style.display = unl ? "" : "none"
	document.getElementById("higgstabbtn").style.display = (unl && tmp.ngp3c) ? "" : "none"
	document.getElementById("hmRow").style.display = (unl && tmp.ngp3c) ? "" : "none"
	if (!unl) updateNextParticleUnlockDisplay()
}

function bosonicLabReset() {
	delete tmp.qu.nanofield.apgWoke
	player.ghostify.neutrinos.electron = new Decimal(0)
	player.ghostify.neutrinos.mu = new Decimal(0)
	player.ghostify.neutrinos.tau = new Decimal(0)
	player.ghostify.ghostlyPhotons.amount = new Decimal(0)
	player.ghostify.ghostlyPhotons.darkMatter = new Decimal(0)
	player.ghostify.ghostlyPhotons.ghostlyRays = new Decimal(0)
	player.ghostify.ghostlyPhotons.lights = [0,0,0,0,0,0,0,0]
	if (tmp.ngp3c) player.condensed.light = [null, 0, 0, 0, 0, 0, 0, 0, 0];
	tmp.updateLights = true
	var startingEnchants = getEnchantEffect(14, true).bUpgs||0
	var keepAllUpgs = hasBosonicUpg(62) && tmp.ngp3c
	player.ghostify.bl = {
		watt: new Decimal(0),
		ticks: player.ghostify.bl.ticks,
		speed: 0,
		am: new Decimal(0),
		typeToExtract: player.ghostify.bl.typeToExtract,
		extracting: false,
		extractProgress: new Decimal(0),
		autoExtract: new Decimal(0),
		glyphs: [],
		enchants: {},
		usedEnchants: tmp.ngp3c?player.ghostify.bl.usedEnchants:[],
		upgrades: keepAllUpgs?player.ghostify.bl.upgrades:[],
		battery: new Decimal(0),
		odSpeed: player.ghostify.bl.odSpeed,
		UPGSUNL: tmp.ngp3c?true:undefined,
	}
	if (!keepAllUpgs) {
		var order = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35, 41, 42, 43, 44, 45, 51, 52, 53, 54, 55, 61, 62, 63, 64, 65]
		//tmp.bl.upgrades needs to be updated (also 12 needs to be added)
		for (let i = 0; i < startingEnchants; i++){
			if (i == 20 && !tmp.ngp3c) break
			player.ghostify.bl.upgrades.push(order[i])
		}
		if (!player.ghostify.bl.upgrades.includes(32) && player.achievements.includes("ng3p92")) player.ghostify.bl.upgrades.push(32)
	}
	for (var g = 1; g <= br.maxLimit; g++) player.ghostify.bl.glyphs.push(new Decimal(0))
	player.ghostify.wzb = {
		unl: true,
		dP: new Decimal(0),
		dPUse: 0,
		wQkUp: true,
		wQkProgress: new Decimal(0),
		zNeGen: 1,
		zNeProgress: new Decimal(0),
		zNeReq: new Decimal(1),
		wpb: new Decimal(0),
		wnb: new Decimal(0),
		zb: new Decimal(0),
		WZBUNL: tmp.ngp3c?true:undefined,
	}
	if (tmp.ngp3c) for (let x in player.ghostify.hb.masses) player.ghostify.hb.masses[x] = new Decimal(0);
	updateBosonicAMDimReturnsTemp()
	ghostify(false, true)
	matchTempPlayerHiggs()
}

function higgsReset() {
	if (tmp.ngp3l) return
	var oldHiggs = player.ghostify.hb.higgs
	if (!player.ghostify.bl.am.gte(getHiggsRequirement())) return
	if (!player.aarexModifications.higgsNoConf && !confirm("You will exchange all your Bosonic Lab stuff for Higgs Bosons. Everything that Light Empowerments resets initally will be reset. Are you ready to proceed?")) return
	addHiggs(getHiggsGain())
	if (!hasAch("ng3pc17")) bosonicLabReset()
	if (oldHiggs == 0) {
		giveAchievement("The Holy Particle")
		updateNeutrinoBoosts()
		updateHiggsUnlocks()
		updateBosonicLimits()
		if (!tmp.ngp3c) updateBosonicStuffCosts()
		document.getElementById("higgsConfirmBtn").style.display = "inline-block"
	}
	if (tmp.ngp3c) {
		if (oldHiggs <= 2) updateBosonicStuffCosts();
		triggerHiggsMechUnlocks(player.ghostify.hb.higgs)
	}
	player.ghostify.hb.bosonicSemipowerment = true
	matchTempPlayerHiggs()
}

function restartHiggs(force=false) {
	if (!force && !player.aarexModifications.higgsNoConf) if (!confirm("Restarting will act as a Higgs reset, but you won't gain anything. Are you sure you want to restart?")) return
	bosonicLabReset()
	player.ghostify.hb.bosonicSemipowerment = true
	matchTempPlayerHiggs()
}

function getHiggsRequirementBase() {
	var div = new Decimal(1)
	if (player.ghostify.bl.usedEnchants.includes(14)) div = div.times(tmp.bEn[14].higgs || 1)
	if (hasBosonicUpg(62) && tmp.ngp3c) div = div.times(tmp.blu[62] || 1)
	return new Decimal(1e20).divide(div)
}

function getHiggsRequirementMult() {
	let mult = new Decimal(100)
	if (player.ghostify.bl.usedEnchants.includes(15) && tmp.ngp3c) mult = mult.root(tmp.bEn[15] || 1);
	return mult;
}

var higgs_scaling = {
	1: {
		name: "Distant",
		start: 50,
		exp: 1.5,
	},
}

function getHiggsScalingName(h) {
	let name = "";
	for (let i=1;i<=Object.keys(higgs_scaling).length;i++) {
		if (h<higgs_scaling[i].start) break;
		else name = higgs_scaling[i].name;
	}
	if (name.length>0) name += " ";
	return name;
}

function getHiggsScalingData(index) {
	let data = JSON.parse(JSON.stringify(higgs_scaling[index]));
	if (hasBosonicUpg(55) && index==1) data.start += 5;
	return data;
}

function implementHiggsReqScaling(x, invert=false) {
	if (!tmp.ngp3c) return x;
	for (let i=1;i<=Object.keys(higgs_scaling).length;i++) {
		if (invert) i = Object.keys(higgs_scaling).length-i+1
		let data = getHiggsScalingData(i);
		if (x<data.start) continue;
		if (invert) x = Math.pow(x * Math.pow(data.start, data.exp-1), 1/data.exp)
		else x = Math.pow(x, data.exp) / Math.pow(data.start, data.exp-1)
	}
	return x;
}

function getHiggsRequirement(higgs) {
	if (higgs === undefined) higgs = player.ghostify.hb.higgs
	let x = getHiggsRequirementMult().pow(implementHiggsReqScaling(higgs)).times(getHiggsRequirementBase())
	return x
}

function getHiggsGain() {
	if (player.ghostify.hb.higgs == 0) return 1
	return Math.max(Math.floor(implementHiggsReqScaling(player.ghostify.bl.am.div(getHiggsRequirementBase()).max(1).log(getHiggsRequirementMult()), true) - player.ghostify.hb.higgs + 1), 0)
}

function addHiggs(x) {
	player.ghostify.hb.higgs += x
}

function matchTempPlayerHiggs(){
	tmp.hb = player.ghostify.hb
	tmp.bl = player.ghostify.bl
}

// Higgs Mechanism (NG+3C Exclusive)

var hm = {
	limit: 9,
	watts: {
		title: "Bosonic Watts",
		req: 1,
		subfactor: "A",
		gain(h) { return Decimal.pow(tmp.hm.gb, h).sub(1).max(0).times(player.ghostify.bl.watt).div(50) },
		eff(x) { return Math.sqrt(x.plus(1).log10()+1) },
		display(e) { return "Multiplies Bosonic Watt conversion to Bosonic Speed by "+shorten(e) },
	},
	wb: {
		title: "W Bosons",
		req: 2,
		subfactor: "E",
		gain(h) { return Decimal.pow(tmp.hm.gb, h-1).sub(1).max(0).times(player.ghostify.wzb.wpb.plus(player.ghostify.wzb.wnb).root(9)).div(10) },
		eff(x) { return Decimal.pow(10, Math.pow(x.plus(1).log10(), .95)) },
		display(e) { return "W Bosons' boost to extraction speed is squared below "+shorten(e)+"x" },
	},
	dm: {
		title: "Dark Matter",
		req: 3,
		subfactor: "Z",
		gain(h) { return Decimal.pow(tmp.hm.gb, h-2).sub(1).max(0).times(player.ghostify.ghostlyPhotons.darkMatter.root(4.5)).div(1e4) },
		eff(x) { return x.plus(1).pow(.9) },
		display(e) { return "Multiplies the Ghostly Ray limit by "+shorten(e) },
	},
	electrons: {
		title: "Electrons",
		req: 5,
		subfactor: "H",
		gain(h) { return Decimal.pow(tmp.hm.gb, h-4).sub(1).max(0).times(player.quantum.electrons.amount).div(1e7) },
		eff(x) { return Math.log2(x.plus(1).log10()+1)/6 },
		display(e) { return "Increases Electron Upgrade effects by +"+shorten(e)+"x" },
	},
	zb: {
		title: "Z Bosons",
		req: 12,
		subfactor: "Z",
		gain(h) { return Decimal.pow(tmp.hm.gb, h-11).sub(1).max(0).times(player.ghostify.wzb.zb.root(11)).div(100) },
		eff(x) { return Math.sqrt(Math.log2(x.plus(1).log10()+1))/8 },
		display(e) { return "Increases the Z Boson effect exponent by "+getFullExpansion(Math.round(e*1000)/1000) },
	},
	quarks: {
		title: "Quarks",
		req: 16,
		subfactor: "A",
		gain(h) { return Decimal.pow(tmp.hm.gb, h-15).sub(1).max(0).times((quantumWorth||new Decimal(0)).root(3500)).div(100) },
		eff(x) { return Decimal.pow(10, Math.pow(x.plus(1).log10(), .95)).plus(1).pow(125) },
		display(e) { return "Multiplies Colored Quark gain by "+shorten(e) },
	},
	preons: {
		title: "Preons",
		req: 20,
		subfactor: "E",
		gain(h) { return Decimal.pow(tmp.hm.gb, h-19).sub(1).max(0).times(tmp.qu.replicants.quarks.root(1125)).div(1e4) },
		eff(x) { return Math.log2(Math.log(x.plus(1).log10()+1)+1)+1 },
		display(e) { return "Strengthens both Preon effects by "+(e*100-100).toFixed(3)+"%" },
	},
	tp: {
		title: "Tachyon Particles",
		req: 25,
		subfactor: "H",
		gain(h) { return Decimal.pow(tmp.hm.gb, h-24).sub(1).times(player.dilation.tachyonParticles.root(2000)).div(1e6) },
		eff(x) { return Math.log2(x.plus(1).log10()+1)*15 },
		display(e) { return "Gives "+getFullExpansion(Math.round(e*10)/10)+" of each Dilation rebuyable upgrade" },
	},
	gph: {
		title: "Ghostly Photons",
		req: 36,
		subfactor: "Z",
		gain(h) { return Decimal.pow(tmp.hm.gb, h-35).sub(1).times(player.ghostify.ghostlyPhotons.amount.root(18)).div(1e7) },
		eff(x) { return x.plus(1).pow(.9) },
		display(e) { return "Multiplies Ghostly Ray production by "+shorten(e) },
	},
}

function getParticleMassGainBase() {
	let base = 2;
	if (hasBosonicUpg(44)) base += tmp.blu[44].pm
	return base;
}

function updateHiggsMechanismTab(speed, full=false) {
	if ((!tmp.ngp3c)||(!tmp.hm)||(!tmp.hb)) return;
	let e = hm[Object.keys(hm)[tmp.hm.unlocks+1]]
	document.getElementById("hmReqDiv").style.display = e?"":"none"
	document.getElementById("hmReq").textContent = getFullExpansion(e?e.req:1/0)+" Higgs Boson"+((e?e.req:1/0)==1?"":"s")
	let id = 0;
	for (let type in hm) {
		if (type=="limit") continue;
		document.getElementById("hm"+type+"div").style.display = (tmp.hb.masses[type]!==undefined)?"":"none"
		document.getElementById("hm"+type+"div").className = particleMassSelected(id)?("subFactor"+hm[type].subfactor):""
		if (tmp.hb.masses[type]===undefined) continue;
		document.getElementById("hm"+type).textContent = shorten(tmp.hb.masses[type]);
		document.getElementById("hm"+type+"gain").textContent = shorten(tmp.hm[type].gain.times(particleMassSelected(id)?Decimal.mul(speed, player.achievements.includes("ng3p92")?5:1):(hasBosonicUpg(32)?(tmp.hm[type].gain.div(10).sqrt().min(tmp.hm[type].gain).times(speed).div(tmp.hm[type].gain)):0)));
		document.getElementById("hm"+type+"eff").textContent = hm[type].display(tmp.hm[type].eff);
		document.getElementById("hm"+type+"sel").textContent = particleMassSelected(id)?" (SELECTED)":""
		if (full) updateHiggsMechSelectBtn(type, id)
		id++;
	}
}

function triggerHiggsMechUnlocks(h) {
	let next = Object.keys(hm)[tmp.hm.unlocks+1];
	if (next) if (h >= hm[next].req) {
		player.ghostify.hb.masses[next] = new Decimal(0);
		updateHiggsMechSelectBtn(next, tmp.hm.unlocks)
	}
}

function higgsMechanismTick(diff) {
	let type = Object.keys(hm)[player.ghostify.hb.mechType+1];
	if (player.achievements.includes("ng3p96") || player.ghostify.hb.masses[type]) {
		let m = new Decimal(1)
		if (player.achievements.includes("ng3p92")) m = Decimal.mul(m, 5);
		
		if (player.achievements.includes("ng3p96")) for (let t in player.ghostify.hb.masses) player.ghostify.hb.masses[t] = player.ghostify.hb.masses[t].plus(tmp.hm[t].gain.times(diff).times(m))
		else player.ghostify.hb.masses[type] = player.ghostify.hb.masses[type].plus(tmp.hm[type].gain.times(diff).times(m));
	}
	if (hasBosonicUpg(32) && !player.achievements.includes("ng3p96")) for (let t in player.ghostify.hb.masses) if (t!=type) player.ghostify.hb.masses[t] = player.ghostify.hb.masses[t].plus(tmp.hm[t].gain.div(10).sqrt().min(tmp.hm[t].gain).times(diff))
}

function updateHiggsMechSelectBtn(type, id) {
	document.getElementById("hm"+type+"selectbtn").style.display = particleMassSelected(id)?"none":""
}

function toggleHiggsMech(id) {
	if (!tmp.ngp3c) return;
	if (particleMassSelected(id)) return;
	let noreset = player.achievements.includes("ng3p92")
	if (!player.aarexModifications.higgsNoConf && !noreset) if (!confirm("Toggling this Particle Mass will force a Higgs reset! Are you sure you want to do this?")) return;
	let prev = player.ghostify.hb.mechType
	player.ghostify.hb.mechType = id;
	updateHiggsMechSelectBtn(Object.keys(hm)[prev+1], prev)
	updateHiggsMechSelectBtn(Object.keys(hm)[id+1], id)
	if (!noreset) restartHiggs(true);
}

function particleMassSelected(id) {
	return player.achievements.includes("ng3p96") || player.ghostify.hb.mechType==id
}

function getHiggsDirectEffHTML() {
	if (!tmp.ngp3c) return ""
	let html = ""
	if (player.achievements.includes("ng3p98")) html += ", which increase the Bosonic AM gain exponent by <span class='yellow' style='font-size: 30px;'>"+shorten(tmp.hm.baseEff||0)+"</span>"
	return html;
}