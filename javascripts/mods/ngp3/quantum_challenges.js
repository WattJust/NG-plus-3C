var quantumChallenges = {
	costs:[0, 16750, 19100, 21500,  24050,  25900,  28900, 31300, 33600],
	goals:[0, 6.65e9, 7.68e10, 4.525e10, 5.325e10, 1.344e10, 5.61e8, 6.254e10, 2.925e10],
	cond_costs: [0, 8175, 9000, 10050, 10725, 11685, 12640, 13920, 15325],
	cond_goals: [0, 4.34e8, 2.465e9, 2.6225e9, 2.045e9, 1.4715e9, 9.58e8, 1.447e9, 7.125e6],
}

var assigned = []
var pcFocus = 0
function updateQuantumChallenges() {
	if (!tmp.ngp3 || !player.masterystudies.includes("d8")) {
		document.getElementById("qctabbtn").style.display = "none"
		return
	} else document.getElementById("qctabbtn").style.display = ""
	assigned = []
	var assignedNums = {}
	document.getElementById("bigrip").style.display = player.masterystudies.includes("d14") ? "" : "none"
	document.getElementById("pairedchallenges").style.display = player.masterystudies.includes("d9") ? "" : "none"
	document.getElementById("respecPC").style.display = player.masterystudies.includes("d9") ? "" : "none"
	for (var pc = 1; pc <= 4; pc++) {
		var subChalls = tmp.qu.pairedChallenges.order[pc]
		if (subChalls) for (var sc=0; sc < 2; sc++) {
			var subChall = subChalls[sc]
			if (subChall) {
				assigned.push(subChall)
				assignedNums[subChall] = pc
			}
		}
		if (player.masterystudies.includes("d9")) {
			var property = "pc" + pc
			var sc1 = tmp.qu.pairedChallenges.order[pc] ? tmp.qu.pairedChallenges.order[pc][0] : 0
			var sc2 = (sc1 ? tmp.qu.pairedChallenges.order[pc].length > 1 : false) ? tmp.qu.pairedChallenges.order[pc][1] : 0
			document.getElementById(property+"desc").textContent = "Paired Challenge "+pc+": Both Quantum Challenge " + (sc1 ? sc1 : "?") + " and " + (sc2 ? sc2 : "?") + " are applied."
			document.getElementById(property+"cost").textContent = "Cost: " + (sc2 ? getFullExpansion(getQCCost(pc + 8)) : "???") + " electrons"
			document.getElementById(property+"goal").textContent = "Goal: " + (sc2 ? shortenCosts(Decimal.pow(10, getQCGoal(pc + 8))) : "???") + " antimatter"
			document.getElementById(property).textContent = pcFocus == pc ? "Cancel" : (tmp.qu.pairedChallenges.order[pc] ? tmp.qu.pairedChallenges.order[pc].length < 2 : true) ? "Assign" : tmp.qu.pairedChallenges.completed >= pc ? "Completed" : tmp.qu.pairedChallenges.completed + 1 < pc ? "Locked" : tmp.qu.pairedChallenges.current == pc ? "Running" : "Start"
			document.getElementById(property).className = pcFocus == pc || (tmp.qu.pairedChallenges.order[pc] ? tmp.qu.pairedChallenges.order[pc].length < 2 : true) ? "challengesbtn" : tmp.qu.pairedChallenges.completed >= pc ? "completedchallengesbtn" : tmp.qu.pairedChallenges.completed + 1 <pc ? "lockedchallengesbtn" : tmp.qu.pairedChallenges.current == pc ? "onchallengebtn" : "challengesbtn"

			var sc1t = Math.min(sc1, sc2)
			var sc2t = Math.max(sc1, sc2)
			if (player.masterystudies.includes("d14") && !tmp.ngp3c) {
				document.getElementById(property + "br").style.display = ""
				document.getElementById(property + "br").textContent = sc1t != 6 || sc2t != 8 ? "QC6 & 8" : tmp.qu.bigRip.active ? "Big Ripped" : tmp.qu.pairedChallenges.completed + 1 < pc ? "Locked" : "Big Rip"
				document.getElementById(property + "br").className = sc1t != 6 || sc2t != 8 ? "lockedchallengesbtn" : tmp.qu.bigRip.active ? "onchallengebtn" : tmp.qu.pairedChallenges.completed + 1 < pc ? "lockedchallengesbtn" : "bigripbtn"
			} else document.getElementById(property + "br").style.display = "none"
		}
	}
	document.getElementById("brngp3cdiv").style.display = (player.masterystudies.includes("d14") && tmp.ngp3c)?"":"none";
	if (player.masterystudies.includes("d14") && tmp.ngp3c) {
		document.getElementById("brngp3c").textContent = sc1t != 6 || sc2t != 8 ? "QC6+7+8" : tmp.qu.bigRip.active ? "Big Ripped" : tmp.qu.pairedChallenges.completed + 1 < pc ? "Locked" : "Big Rip"
		document.getElementById("brngp3c").className = tmp.qu.bigRip.active ? "onchallengebtn" : "bigripbtn"
		document.getElementById("brngp3ccost").textContent = "Cost: "+getFullExpansion(NGP3C_BR_COST)+" electrons"
		document.getElementById("brngp3cgoal").textContent = "Goal: "+shortenCosts(NGP3C_BR_GOAL)+" antimatter"
	}
	if (player.masterystudies.includes("d14")) {
		var max = getMaxBigRipUpgrades()
		document.getElementById("spaceShards").textContent = shortenDimensions(tmp.qu.bigRip.spaceShards)
		for (var u = 18; u <= 20; u++) document.getElementById("bigripupg" + u).parentElement.style.display = u > max ? "none" : ""
		for (var u = 1; u <= max; u++) {
			document.getElementById("bigripupg" + u).className = tmp.qu.bigRip.upgrades.includes(u) ? "gluonupgradebought bigrip" + (isBigRipUpgradeActive(u, true) ? "" : "off") : tmp.qu.bigRip.spaceShards.lt(getBigRipUpgCost(u)) ? "gluonupgrade unavailablebtn" : "gluonupgrade bigrip"
			document.getElementById("bigripupg" + u + "cost").textContent = shortenDimensions(new Decimal(getBigRipUpgCost(u)))
		}
	}
	for (var qc = 1; qc <= 8; qc++) {
		var property = "qc" + qc
		document.getElementById(property + "div").style.display = (qc < 2 || QCIntensity(qc - 1)) ? "inline-block" : "none"
		document.getElementById(property).textContent = ((!assigned.includes(qc) && pcFocus) ? "Choose" : inQC(qc, true) ? "Running" : QCIntensity(qc) ? (assigned.includes(qc) ? "Assigned" : "Completed") : "Start") + (assigned.includes(qc) ? ((tmp.ngp3c && tmp.qu.bigRip.active && qc>=6)?" (BR)":(" (PC" + assignedNums[qc] + ")")) : "")
		document.getElementById(property).className = (!assigned.includes(qc) && pcFocus) ? "challengesbtn" : inQC(qc, true) ? "onchallengebtn" : QCIntensity(qc) ? "completedchallengesbtn" : "challengesbtn"
		document.getElementById(property + "cost").textContent = "Cost: " + getFullExpansion(getQCCost(qc)) + " electrons"
		document.getElementById(property + "goal").textContent = "Goal: " + shortenCosts(Decimal.pow(10, getQCGoal(qc))) + " antimatter"
	}
	updateQCDisplaysSpecifics()
}

function updateQCDisplaysSpecifics(){
	document.getElementById("qc2reward").textContent = Math.round(tmp.qcRewards[2] * 1000 - 1000)/10
	document.getElementById("qc7desc").textContent = "Dimension and Tickspeed cost multiplier increases are " + shorten(Number.MAX_VALUE) + "x. Multiplier per ten Dimensions and meta-Antimatter boost to Dimension Boosts are disabled."
	document.getElementById("qc7reward").textContent = (100 - tmp.qcRewards[7] * 100).toFixed(2)
	document.getElementById("qc8desc").textContent = tmp.ngp3c ? "You are trapped in EC7 & EC13, which also apply to Meta Dimensions. Third Meta Dimensions generate Meta Antimatter, and Infinity & Time Condensers are based on their respective first dimensions. Time Dimension amounts do not contribute to their generation. However, Meta Condensers are 115% stronger." : "Infinity and Time Dimensions are disabled, and Meta-Dimension Boosts have no effect."
	if (tmp.ngp3c) document.getElementById("qc8desc").style["font-size"] = "7.5px"
	document.getElementById("qc8reward").textContent = tmp.ngp3c?(getFullExpansion(Math.round(tmp.qcRewards[8]*1e5)/1e3)+"% slower"):(tmp.qcRewards[8]+"x faster")
}

function inQC(num, direct=false) {
	if (!direct) {
		if (num==8) return tmp.inQCs.includes(8) && !tmp.ngp3c
		else if (num=="8c") return tmp.inQCs.includes(8) && tmp.ngp3c
	}
	return tmp.inQCs.includes(num)
}

function updateInQCs() {
	tmp.inQCs = [0]
	if (tmp.qu !== undefined && tmp.qu.challenge !== undefined) {
		data = tmp.qu.challenge
		if (typeof(data) == "number") data = [data]
		else if (data.length == 0) data = [0]
		tmp.inQCs = data
	}
	
	if (tmp.qu) if (tmp.qu.bigRip.active && tmp.ngp3c) tmp.inQCs = [6,7,8];
}

function getQCGoal(num, bigRip) {
	if (player.masterystudies == undefined) return 0
	var c1 = 0
	var c2 = 0
	var mult = 1
	if (player.achievements.includes("ng3p96") && !bigRip && !tmp.ngp3c) mult *= 0.95
	if (tmp.ngp3c) mult *= QCModifierExp()
	let goalData = quantumChallenges[player.aarexModifications.ngp3c?"cond_goals":"goals"]
	if (num == undefined) {
		var data = tmp.inQCs
		if (data[0]) c1 = data[0]
		if (data[1]) c2 = data[1]
		if (tmp.an) mult *= (an_pc_mods[c1]||1)*(an_pc_mods[c2]||1)
		if (tmp.ngp3c && data[2]) bigRip = true;
	} else if (num < 9) {
		c1 = num
		if (tmp.an) mult *= an_pc_mods[c1]||1
	} else if (tmp.qu.pairedChallenges.order[num - 8]) {
		c1 = tmp.qu.pairedChallenges.order[num - 8][0]
		c2 = tmp.qu.pairedChallenges.order[num - 8][1]
		if (tmp.an) mult *= (an_pc_mods[c1]||1)*(an_pc_mods[c2]||1)
	}
	if (c1 == 0) return goalData[0] * mult
	if (c2 == 0) return goalData[c1] * mult
	var cs = [c1, c2]
	mult *= mult
	if (cs.includes(1) && cs.includes(3)) mult *= 1.6
	if (cs.includes(2) && cs.includes(6)) mult *= 1.7
	if (cs.includes(3) && cs.includes(7)) mult *= 2.68
	if (!tmp.ngp3l && cs.includes(3) && cs.includes(6)) mult *= 3
	if (tmp.ngp3c && cs.includes(6) && cs.includes(8) && !bigRip) mult *= 8
	let div = 1e11
	if (tmp.ngp3c) {
		div = 2e9;
		if (bigRip) div *= 3.09
		if (cs.some(x => x>4)) {
			if (c1>4) div /= 1.5
			if (c2>4) div /= 1.5
		}
	}
	return goalData[c1] * goalData[c2] / div * mult
}

function QCIntensity(num) {
	if (tmp.ngp3 && tmp.qu !== undefined && tmp.qu.challenges !== undefined) return tmp.qu.challenges[num] || 0
	return 0
}

function updateQCTimes() {
	document.getElementById("qcsbtn").style.display = "none"
	if (!player.masterystudies) return
	var temp = 0
	var tempcounter = 0
	for (var i = 1; i < 9; i++) {
		setAndMaybeShow("qctime" + i, tmp.qu.challengeRecords[i], '"Quantum Challenge ' + i + ' time record: "+timeDisplayShort(tmp.qu.challengeRecords[' + i + '], false, 3)')
		if (tmp.qu.challengeRecords[i]) {
			temp+=tmp.qu.challengeRecords[i]
			tempcounter++
		}
	}
	if (tempcounter > 0) document.getElementById("qcsbtn").style.display = "inline-block"
	setAndMaybeShow("qctimesum", tempcounter > 1, '"The sum of your completed Quantum Challenge time records is "+timeDisplayShort(' + temp + ', false, 3)')
}

var ranking=0
function updatePCCompletions() {
	var shownormal = false
	document.getElementById("pccompletionsbtn").style.display = "none"
	if (!player.masterystudies) return;
	var r = 0
	tmp.pcc = {} // PC Completion counters
	for (var c1 = 2; c1 < 9; c1++) for (var c2 = 1; c2 < c1; c2++) {
		var rankingPart = 0
		if (tmp.qu.pairedChallenges.completions[c2 * 10 + c1]) {
			rankingPart = 5 - tmp.qu.pairedChallenges.completions[c2 * 10 + c1]
			tmp.pcc.normal = (tmp.pcc.normal || 0) + 1
		} else if (c2 * 10 + c1 == 68 && ghostified) {
			rankingPart = 0.5
			tmp.pcc.normal = (tmp.pcc.normal || 0) + 1
		}
		if (tmp.qu.qcsNoDil["pc" + (c2 * 10 + c1)]) {
			rankingPart += 5 - tmp.qu.qcsNoDil["pc" + ( c2 * 10 + c1)]
			tmp.pcc.noDil = (tmp.pcc.noDil || 0) + 1
		}
		for (var m = 0; m < qcm.modifiers.length; m++) {
			var id = qcm.modifiers[m]
			var data = tmp.qu.qcsMods[id]
			if (data && data["pc" + (c2 * 10 + c1)]) {
				rankingPart += 5 - data["pc" + (c2 * 10 + c1)]
				tmp.pcc[id] = (tmp.pcc[id] || 0) + 1
				shownormal = true
			}
		}
		r += Math.sqrt(rankingPart)
	}
	r *= 100 / 56
	if (r) document.getElementById("pccompletionsbtn").style.display = "inline-block"
	document.getElementById("pccranking").textContent = r.toFixed(1)
	document.getElementById("pccrankingMax").textContent = Math.sqrt(1e4 * (2 + qcm.modifiers.length)).toFixed(1)
	updatePCTable()
	for (var m = 0; m < qcm.modifiers.length; m++) {
		var id = qcm.modifiers[m]
		var shownormal = tmp.qu.qcsMods[id] !== undefined || shownormal
		document.getElementById("qcms_" + id).style.display = tmp.qu.qcsMods[id] !== undefined ? "" : "none"
	}
	document.getElementById("qcms_normal").style.display = shownormal ? "" : "none"
	if (r >= 75) {
		document.getElementById("modifiersdiv").style.display = ""
		document.getElementById("modifierWarning").innerHTML = tmp.ngp3c?("QC Modifiers are raising QC goals ^"+shorten(QCModifierExp())+"<br>Each individual QC completion with one of the modifiers strengthens its effect by 1%."):""
		for (var m = 0; m < qcm.modifiers.length; m++) {
			var id = qcm.modifiers[m]
			if (QCModifierUnl(id, r) || !qcm.reqs[id]) {
				document.getElementById("qcm_" + id).className = qcm.on.includes(id) ? "chosenbtn" : "storebtn"
				document.getElementById("qcm_" + id).setAttribute('ach-tooltip', (qcm.descs[id] || "???")+(tmp.ngp3c?(" Also raises QC goals ^"+shorten(qcm.condExps[id] || 1)+"."):""))
			} else {
				document.getElementById("qcm_" + id).className = "unavailablebtn"
				document.getElementById("qcm_" + id).setAttribute('ach-tooltip', (tmp.an&&id=="sp")?"Exit Annihilation to use this modifier.":(tmp.ngp3c?(qcm.condReqDescs[id]+" to unlock this modifier."):('Get ' + qcm.reqs[id] + ' Paired Challenges ranking to unlock this modifier. Ranking: ' + ranking.toFixed(1))))
			}
		}
	} else document.getElementById("modifiersdiv").style.display = (tmp.ngp3c && QCModifierUnl("ad", r))?"":"none"
	
	ranking = r // its global
}

function QCModifierExp() {
	let exp = 1;
	for (let m = 0; m < qcm.modifiers.length; m++) if (inQCModifier(qcm.modifiers[m])) exp *= qcm.condExps[qcm.modifiers[m]]
	return exp;
}

function QCModifierEff(qc) {
	if (!tmp.qu.qcsMods) return 1;
	let mul = 1
	for (let m = 0; m < qcm.modifiers.length; m++) {
		if (!tmp.qu.qcsMods[qcm.modifiers[m]]) continue;
		mul *= Math.pow(1.01, tmp.qu.qcsMods[qcm.modifiers[m]]["qc"+qc]||0)
	}
	return mul;
}

let qcRewards = {
	effects: {
		1: function(comps) {
			if (comps == 0) return 1
			comps *= QCModifierEff(1);
			let base = Decimal.mul(getDimensionFinalMultiplier(1), getDimensionFinalMultiplier(2)).max(1).log10()
			let exp = 0.225 + comps * .025
			let div = player.aarexModifications.ngp3c?(25/Math.pow(3, comps)):200
			return Decimal.pow(10, Math.pow(base, exp) / div)
		},
		2: function(comps) {
			if (comps == 0) return 1
			comps *= QCModifierEff(2);
			return 1.2 + comps * 0.2
		},
		3: function(comps) {
			if (comps == 0) return 1
			comps *= QCModifierEff(3);
			let exp = Math.log10(player.quantum.gluons.gb.plus(1).log10()+1)*3+1
			let ipow = player.infinityPower.plus(1).log10()
			let log = Math.sqrt(ipow / 2e8) 
			if (comps >= 2) log += Math.pow(ipow / 1e9, 4/9 + comps/9)
			if (tmp.ngp3c) log *= exp;
			
			log = softcap(log, "qc3reward")
			return Decimal.pow(10, log)
		},
		4: function(comps) {
			if (comps == 0) return 1
			comps *= QCModifierEff(4);
			let mult = player.meta[2].amount.times(player.meta[4].amount).times(player.meta[6].amount).times(player.meta[8].amount).max(1)
			if (comps <= 1) return Decimal.pow(10 * comps, Math.sqrt(mult.log10()) / 10)
			return mult.pow(comps / 150)
			
		},
		5: function(comps) {
			if (comps == 0) return 0
			comps *= QCModifierEff(5);
			let r = player.resets
			return Math.log10(1 + r) * Math.pow(comps, 0.4)
		},
		6: function(comps) {
			if (comps == 0) return 1
			comps *= QCModifierEff(6);
			let mag = player.aarexModifications.ngp3c?((Math.log10(player.quantum.gluons.rg.plus(1).log10()+1)+1)*comps):comps
			return player.achPow.pow(mag * 2 - 1)
		},
		7: function(comps) {
			if (comps == 0) return 1
			comps *= QCModifierEff(7);
			return Math.pow(0.975, comps)
		},
		8: function(comps) {
			if (comps == 0) return tmp.ngp3c?0:1;
			comps *= QCModifierEff(8);
			if (tmp.ngp3c) {
				let br = player.quantum.gluons.br
				if (br.gte(1e10)) br = Decimal.mul(br.log10(), 1e9)
				let ret = 1-1/(br.plus(1).log10()*comps*1.1+1)
				if (ret>=0.95) {
					if (hasNU(6)) {
						ret = Math.min(ret, 0.99);
					} else ret = 0.95;
				}
				return ret;
			} else return comps + 2
		}
	}
}

function updateQCRewardsTemp() {
	tmp.qcRewards = {}
	for (var c = 1; c <= 8; c++) tmp.qcRewards[c] = qcRewards.effects[c](QCIntensity(c))
}

function getQCCost(num) {
	if (player.achievements.includes("ng3p55")) return 0
	let costData = quantumChallenges[player.aarexModifications.ngp3c?"cond_costs":"costs"]
	if (num > 8) return costData[tmp.qu.pairedChallenges.order[num - 8][0]] + costData[tmp.qu.pairedChallenges.order[num - 8][1]]
	return costData[num]
}

function showQCModifierStats(id) {
	tmp.pct = id
	updatePCTable()
}

function updatePCTable() {
	var data=tmp.qu.qcsMods[tmp.pct]
	for (r = 1; r < 9; r++) for (c = 1; c < 9; c++) {
		if (r != c) {
			var divid = "pc" + (r * 10 + c)
			var pcid = r * 10 + c
			if (r > c) pcid = c * 10  +r
			if (tmp.pct == "") {
				var comp = tmp.qu.pairedChallenges.completions[pcid]
				if (comp !== undefined) {
					document.getElementById(divid).textContent = "PC" + comp
					document.getElementById(divid).className = (tmp.qu.qcsNoDil["pc" + pcid] ? "nd" : "pc" + comp) + "completed"
					var achTooltip = 'Fastest time: ' + (tmp.qu.pairedChallenges.fastest[pcid] ? timeDisplayShort(tmp.qu.pairedChallenges.fastest[pcid]) : "N/A")
					if (tmp.qu.qcsNoDil["pc" + pcid]) achTooltip += ", No dilation: PC" + tmp.qu.qcsNoDil["pc" + pcid]
					document.getElementById(divid).setAttribute('ach-tooltip', achTooltip)
					if (divid=="pc38") giveAchievement("Hardly marked")
					if (divid=="pc68" && !tmp.ngp3c) giveAchievement("Big Rip isn't enough")
				} else if (pcid == 68 && ghostified) {
					document.getElementById(divid).textContent = "BR"
					document.getElementById(divid).className = "brCompleted"
					document.getElementById(divid).removeAttribute('ach-tooltip')
					document.getElementById(divid).setAttribute('ach-tooltip', 'Fastest time from start of Ghostify: ' + timeDisplayShort(player.ghostify.best))
				} else {
					document.getElementById(divid).textContent = ""
					document.getElementById(divid).className = ""
					document.getElementById(divid).removeAttribute('ach-tooltip')
				}
			} else if (data&&data["pc" + pcid]) {
				var comp = data["pc" + pcid]
				document.getElementById(divid).textContent = "PC" + comp
				document.getElementById(divid).className = "pc" + comp + "completed"
				document.getElementById(divid).removeAttribute('ach-tooltip')
			} else {
				document.getElementById(divid).textContent = ""
				document.getElementById(divid).className = ""
				document.getElementById(divid).removeAttribute('ach-tooltip')
			}
		} else { // r == c
			var divid = "qcC" + r
			if (tmp.pct == "" || (data && data["qc" + r])) {
				document.getElementById(divid).textContent = "QC"+r
				if (tmp.qu.qcsNoDil["qc" + r] && tmp.pct == "") {
					document.getElementById(divid).className = "ndcompleted"
					document.getElementById(divid).setAttribute('ach-tooltip', "No dilation achieved!")
				} else {
					document.getElementById(divid).className = "pc1completed"
					document.getElementById(divid).removeAttribute('ach-tooltip')
				}
			} else {
				document.getElementById(divid).textContent = ""
				document.getElementById(divid).className = ""
				document.getElementById(divid).removeAttribute('ach-tooltip')
			}
		}
	}
	document.getElementById("upcc").textContent = (tmp.pct == "" ? "Unique PC completions" : (qcm.names[tmp.pct] || "???")) + ": " + (tmp.pcc.normal || 0) + " / 28"
	document.getElementById("udcc").style.display = tmp.pct == "" ? "block" : "none"
	document.getElementById("udcc").textContent="No dilation: " + (tmp.pcc.noDil || 0) + " / 28"
}

var qcm={
	modifiers:["ad", "sm", "sp"],
	names:{
		ad: "Anti-Dilation",
		sm: "Supermastery",
		sp: "Spiritual"
	},
	reqs:{
		ad: 100,
		sm: 165,
		sp: 1/0
	},
	condReqs: {
		ad() { return player.ghostify.wzb.unl },
		sm() { return player.ghostify.hb.unl },
		sp() { return player.dilation.break.unl && !tmp.an },
	},
	condReqDescs: {
		ad: "Unlock Bosonic Lab",
		sm: "Unlock Higgs Bosons",
		sp: "Unlock Break Dilation",
	},
	descs:{
		ad: "You always have no Tachyon particles. You can dilate time, but you can't gain Tachyon particles.",
		sm: "You can't have normal Time Studies, and can't have more than 20 normal Mastery Studies.",
		sp: "Starting a Quantum Challenge forces a Ghostify reset, and all Normal Dimension & Tickspeed Obscurements are 400% stronger."
	},
	condExps: {
		ad: 2,
		sm: 250,
		sp: 1e5,
	},
	on: []
}

function QCModifierUnl(id, r) {
	if (tmp.an && id=="sp") return false;
	else if (tmp.ngp3c) return qcm.condReqs[id]();
	else return r >= qcm.reqs[id];
}

function toggleQCModifier(id) {
	if (!QCModifierUnl(id, ranking) && qcm.reqs[id]) return
	if (qcm.on.includes(id)) {
		let data = []
		for (var m = 0; m < qcm.on.length; m++) if (qcm.on[m] != id) data.push(qcm.on[m])
		qcm.on = data
	} else qcm.on.push(id)
	document.getElementById("qcm_" + id).className=qcm.on.includes(id) ? "chosenbtn" : "storebtn"
}

function inQCModifier(id) {
	if (player.masterystudies == undefined) return
	return tmp.qu.qcsMods.current.includes(id)
}

function recordModifiedQC(id, num, mod) {
	var data = tmp.qu.qcsMods[mod]
	if (data === undefined) {
		data = {}
		tmp.qu.qcsMods[mod] = data
	}
	if (data[id] === undefined) data[id] = num
	else data[id] = Math.min(num, data[id])
}
