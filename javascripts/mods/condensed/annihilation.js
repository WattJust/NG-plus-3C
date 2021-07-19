var annihilationReq = 2.025e17;

function initAnnihilationPlayerData() {
    player.ghostify.annihilation = {
        unl: false,
        active: false,
        storage: {
            tt: 0,
            le: 0,
            ts: [],
            ds: [],
            du: [],
            glu: [],
            aglu: [],
            pc: {},
            bru: [],
            be: false,
            beu: [],
            ms: [],
            ml: 0,
        },
        ex: new Decimal(0),
        theorem: 0,
        spentThm: 0,
        dilstudies: [],
        studies: [],
        attractors: [],
        maxTier: 1,
    }
}

function updateAnnihilationUnlocks() {
    let unl = tmp.ngp3c && (player.ghostify?player.ghostify.annihilation.unl:false)
    document.getElementById("annihilationUnl").style.display = unl?"none":""
    document.getElementById("annihilationDiv").style.display = unl?"":"none"
}

function annihilationDisplay() {
    let unl = player.ghostify.annihilation.unl
    if (!unl) document.getElementById("annihilationUnl").innerHTML = "Reach "+shortenCosts(Decimal.pow(10, annihilationReq))+" Antimatter to unlock Annihilation."
    else {
        document.getElementById("annihilateFlavor").textContent = tmp.an?("Reconstruct your timeline to gain "+shortenDimensions(getExoticMatterGain())+" Exotic Matter. Next: "+shortenCosts(getNextExoticMatter())+" antimatter."):"Annihilate your timeline."
        document.getElementById("exMat").textContent = shortenDimensions(player.ghostify.annihilation.ex);
        document.getElementById("exMatTarg").textContent = tmp.and.exTarg
        document.getElementById("exMatEff").textContent = getFullExpansion(Math.round((tmp.and.exEff-1)*1e3)/10)+"%"
    }
}

function unlockAnnihilation() {
    if (!tmp.ngp3c) return;
    $.notify("Congratulations! You have unlocked Annihilation!", "success");
    player.ghostify.annihilation.unl = true;
    updateAnnihilationUnlocks();
}

function annihilate() {
    if (!tmp.ngp3c) return;
    if (!player.ghostify.annihilation.unl) return;
    if (!player.ghostify.annihilation.active) {
        player.ghostify.annihilation.storage.tt = nP(player.timestudy.theorem);
        player.ghostify.annihilation.storage.ts = player.timestudy.studies;
        player.ghostify.annihilation.storage.ds = player.dilation.studies;
        player.ghostify.annihilation.storage.du = player.dilation.upgrades;
        player.ghostify.annihilation.storage.ms = player.masterystudies;
        player.ghostify.annihilation.storage.glu = tmp.qu.upgrades;
        player.ghostify.annihilation.storage.pc = tmp.qu.pairedChallenges;
        player.ghostify.annihilation.storage.bru = tmp.qu.bigRip.upgrades;
        player.ghostify.annihilation.storage.be = tmp.qu.breakEternity.break;
        player.ghostify.annihilation.storage.beu = tmp.qu.breakEternity.upgrades;
        player.ghostify.annihilation.storage.ml = player.ghostify.milestones;
        player.ghostify.annihilation.storage.le = player.ghostify.ghostlyPhotons.enpowerments;

        player.timestudy.studies = [];
        player.masterystudies = [];
        player.timestudy.theorem = 0;
        player.ghostify.milestones = 0;
        player.ghostify.ghostlyPhotons.enpowerments = 0;
        tmp.bd.active = true;
    } else {
        player.ghostify.annihilation.ex = player.ghostify.annihilation.ex.plus(getExoticMatterGain())

        player.ghostify.annihilation.storage.aglu = tmp.qu.upgrades;
        
        player.timestudy.theorem = nP(player.ghostify.annihilation.storage.tt);
        player.timestudy.studies = player.ghostify.annihilation.storage.ts;
        player.dilation.studies = player.ghostify.annihilation.storage.ds;
        player.dilation.upgrades = player.ghostify.annihilation.storage.du;
        player.masterystudies = player.ghostify.annihilation.storage.ms;
        tmp.qu.upgrades = player.ghostify.annihilation.storage.glu;
        tmp.qu.pairedChallenges = player.ghostify.annihilation.storage.pc;
        tmp.qu.bigRip.upgrades = player.ghostify.annihilation.storage.bru;
        tmp.qu.breakEternity.break = player.ghostify.annihilation.storage.be;
        tmp.qu.breakEternity.upgrades = player.ghostify.annihilation.storage.beu;
        player.ghostify.milestones = player.ghostify.annihilation.storage.ml;
        player.ghostify.ghostlyPhotons.enpowerments = player.ghostify.annihilation.storage.le;
    }
    player.condensed.nano = [null, 0, 0, 0, 0, 0, 0, 0, 0];
    bosonicLabReset(true, true);
    fixDilationReset(true);

    player.ghostify.annihilation.active = !player.ghostify.annihilation.active;
    giveAchievement("Into the Antiverse!")

    updateTempAN();

    if (tmp.an) {
        document.getElementById("sacrifice").style.display = "none";
        document.getElementById("confirmation").style.display = "none";
        player.eternityUpgrades = [1,2,3,4,5,6];
        player.dilation.studies = player.ghostify.annihilation.dilstudies.filter(x => x <= 6);
        player.masterystudies = player.ghostify.annihilation.dilstudies.filter(x => x > 6).map(x => "d"+x);
        player.quantum.upgrades = player.ghostify.annihilation.storage.aglu;
        if (player.dilation.studies.includes(1)) player.dilation.upgrades = player.ghostify.annihilation.storage.du;
        showEternityTab("dilationstudies", true)
    } else {
        updateBoughtTimeStudies()
        updateEternityChallenges()
        document.getElementById("masterystudyunlock").style.display = ""
        document.getElementById("nanofieldtabbtn").style.display = ""
		document.getElementById("edtabbtn").style.display = ""
        showEternityTab("timestudies", true)
    }
    document.getElementById("timestudyunlock").style.display = tmp.an?"none":""
    document.getElementById("dilstudyunlock").style.display = tmp.an?"":"none"
    document.getElementById("exoticstudyunlock").style.display = tmp.an?"":"none"
    updateEternityUpgrades()
    updateBreakDilationTabBtn()
    updateSpeedruns()
    updateQuarksTabOnUpdate()
    updateResetTierButtons()
}

function getExoticMatterGainMult() {
    let mult = new Decimal(1)
    if (hasExS(11)) mult = mult.times(3);
    if (hasExS(32)) mult = mult.times(tmp.and.study[32]);
    return mult;
}

function getExoticMatterGain() {
    let gain = new Decimal(Math.max(Math.pow(player.money.l/1e10, 0.9), 0)).times(getExoticMatterGainMult());
    return gain.floor();
}

function getNextExoticMatter() {
    let next = Decimal.pow(10, getExoticMatterGain().plus(1).div(getExoticMatterGainMult()).root(.9).times(1e10))
    return next
}

function drawDilStudyTree() {
    dsctx.clearRect(0, 0, dsc.width, dsc.height);
	if (player === undefined) return
	if (document.getElementById("eternitystore").style.display === "none" || document.getElementById("dilationstudies").style.display === "none" || !tmp.ngp3c || !tmp.an) return
	for (var i = 1; i < availableAnhDilStudies.length; i++) drawDilStudyBranch(String(availableAnhDilStudies[i-1]), String(availableAnhDilStudies[i]))
}

function drawDilStudyBranch(num1, num2) {
    var name2 = parseInt(num2);
    var start = document.getElementById("specDilStudy"+num1).getBoundingClientRect();
    var end = document.getElementById("specDilStudy"+num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    dsctx.lineWidth=15;
    dsctx.beginPath();
    if (player.dilation.studies.includes(name2)||player.masterystudies.includes("d"+name2)) dsctx.strokeStyle="#64DD17";
    else dsctx.strokeStyle="#4b3753";
    dsctx.moveTo(x1, y1);
    dsctx.lineTo(x2, y2);
    dsctx.stroke();
}

function updateDilationStudyButtons() {
    if (!tmp.ngp3c || !tmp.an) return;
    for (let j=0;j<availableAnhDilStudies.length;j++) {
        let i = availableAnhDilStudies[j]
        document.getElementById("specDilStudy"+i).className = (player.dilation.studies.includes(i)||player.masterystudies.includes("d"+i))?"dilationupgbought":(canBuyAnhDilStudy(i)?"dilationupg":"timestudylocked")
        document.getElementById("anhds"+i+"CostReq").textContent = "Cost: "+(nG(anhDilStudyCosts[i], 1e12-1)?shortenDimensions(anhDilStudyCosts[i]):getFullExpansion(anhDilStudyCosts[i]))+" TT"+(anhDilStudyReqs[i]?(", Req: "+anhDilStudyReqs[i].desc()):"")
    }
}

var availableAnhDilStudies = [1,6,7]

var anhDilStudyCosts = {
    1: 1.2e4,
    6: 2.5e21,
    7: 5e26,
}

var anhDilStudyReqs = {
    6: {
        desc() { return shortenCosts(1e90)+" Tachyon Particles" },
        done() { return player.dilation.tachyonParticles.gte(1e90) },
    },
    7: {
        desc() { return shortenCosts(new Decimal("1e960"))+" Quantum Worth" },
        done() { return Decimal.gte(quantumWorth||0, "1e960") },
    },
}

function canBuyAnhDilStudy(x) {
    let can = anhDilStudyReqs[x]?anhDilStudyReqs[x].done():true;
    return nG(player.timestudy.theorem, anhDilStudyCosts[x]) && can;
}

function buyAnhDilStudy(x) {
    if (!tmp.ngp3c || !tmp.an) return;
    if (player.ghostify.annihilation.dilstudies.includes(x)) return;
    if (!canBuyAnhDilStudy(x)) return;
    player.timestudy.theorem = nS(player.timestudy.theorem, anhDilStudyCosts[x]);
    player.ghostify.annihilation.dilstudies.push(x);
    if (x<=6) player.dilation.studies.push(x);
    else {
        player.masterystudies.push("d"+x);
        buyingDilationStudy(x);
    }

    if (x==1) player.dilation.upgrades = player.ghostify.annihilation.storage.du;

    updateDilationStudyButtons();
}

function getExoticMatterEff(type) {
    if (!tmp.ngp3c || player.ghostify.annihilation.ex.eq(0)) return 1;
    let e = player.ghostify.annihilation.ex.l;
    if (type=="Nano-Condensers") return Math.log2(e+1)/5+1.1;
    else if (type=="Time Condensers") return Math.log(e+1)/Math.log(1.1)+1.1;
    else if (type=="Dilation Condensers") return Math.log(e+1)/7.5+1.1;
    else if (type=="Meta Condensers") return Math.log10(e+1)/10+1.1;
    else return 1;
}

var exoticStudies = [
    {
        id: 11,
        branches: [],
        cost: 20,
        shown() { return true },
    },
    {
        id: 21,
        branches: [11],
        cost: 200,
        eff() { return nMx(player.ghostify.annihilation.theorem, 1) },
        dispEff(e) { return shortenDimensions(e)+"x" },
        shown() { return player.ghostify.annihilation.studies.includes(11) },
    },
    {
        id: 22,
        branches: [11],
        cost: 200,
        eff() { return nMx(nS(player.ghostify.annihilation.theorem, player.ghostify.annihilation.spentThm), 1) },
        dispEff(e) { return shortenDimensions(e)+"x" },
        shown() { return player.ghostify.annihilation.studies.includes(11) },
    },
    {
        id: 31,
        branches: [21],
        cost: 1e3,
        shown() { return player.ghostify.annihilation.studies.includes(21) },
    },
    {
        id: 32,
        branches: [21, 22],
        cost: 1e3,
        eff() { return player.ghostify.annihilation.studies.length*player.ghostify.ghostParticles.plus(1).log10()/1e3+1 },
        dispEff(e) { return shorten(e)+"x" },
        shown() { return player.ghostify.annihilation.studies.includes(21) || player.ghostify.annihilation.studies.includes(22) },
    },
    {
        id: 33,
        branches: [22],
        cost: 1e3,
        shown() { return player.ghostify.annihilation.studies.includes(22) },
    },
    {
        id: 41,
        branches: [31, 32, 33],
        cost: 6e3,
        shown() { return player.ghostify.annihilation.studies.includes(31) || player.ghostify.annihilation.studies.includes(32) || player.ghostify.annihilation.studies.includes(33) },
    },
]

function updateExoticStudyButtons() {
    if (!tmp.ngp3c || !tmp.an) return;
    for (let i=0;i<exoticStudies.length;i++) {
        let data = exoticStudies[i]
        let id = data.id;
        document.getElementById("ex"+id).style.display = data.shown()?"":"none"
        document.getElementById("ex"+id).className = player.ghostify.annihilation.studies.includes(id)?"exoticupgbought":(nG(player.ghostify.annihilation.theorem, nA(data.cost, player.ghostify.annihilation.spentThm))?"exoticupg":"timestudylocked")
        document.getElementById("exCost"+id).textContent = nG(data.cost, 1e12-1)?shortenDimensions(data.cost):getFullExpansion(data.cost)
        if (data.eff) document.getElementById("exEff"+id).textContent = data.dispEff(tmp.and.study[data.id])
    }
    let nat = nS(player.ghostify.annihilation.theorem, player.ghostify.annihilation.spentThm)
    document.getElementById("extheorems").innerHTML = nG(nat, 1e80)?("Exotic Theorems: "+shorten(nat)):("Your Exotic Matter & Time Theorems are<br>providing you with <b>"+getFullExpansion(nN(nat))+"</b> Exotic Theorems.")
}

function drawExoticStudyTree() {
    exctx.clearRect(0, 0, exc.width, exc.height);
	if (player === undefined) return
	if (document.getElementById("eternitystore").style.display === "none" || document.getElementById("exoticstudies").style.display === "none" || !tmp.ngp3c || !tmp.an) return
	let shown = exoticStudies.filter(x => x.shown());
    for (var i = 1; i < shown.length; i++) for (let j=0;j<shown[i].branches.length;j++) drawExoticStudyBranch(String(shown[i].branches[j]), String(shown[i].id))
}

function drawExoticStudyBranch(num1, num2) {
    var name2 = parseInt(num2);
    var start = document.getElementById("ex"+num1).getBoundingClientRect();
    var end = document.getElementById("ex"+num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    exctx.lineWidth=15;
    exctx.beginPath();
    if (player.ghostify.annihilation.studies.includes(name2)) exctx.strokeStyle="#dd1717";
    else exctx.strokeStyle="#57493a";
    exctx.moveTo(x1, y1);
    exctx.lineTo(x2, y2);
    exctx.stroke();
}

function buyExoticStudy(i) {
    if (!tmp.ngp3c || !tmp.an) return;
    let data = exoticStudies[i];
    let id = data.id;
    let cost = nA(data.cost, player.ghostify.annihilation.spentThm)
    if (!data.shown()) return;
    if (player.ghostify.annihilation.studies.includes(id)) return;
    if (nL(player.ghostify.annihilation.theorem, cost)) return;
    player.ghostify.annihilation.spentThm = nA(player.ghostify.annihilation.spentThm, data.cost);
    player.ghostify.annihilation.studies.push(id);

    updateExoticStudyButtons()
    drawExoticStudyTree()
}

function hasExS(id) { return tmp.ngp3c && tmp.an && player.ghostify.annihilation.studies.includes(id) };

function getPotentialExThm() {
    let base = Decimal.log10(nA(player.timestudy.theorem, 1))+1;
    let exp = Math.log2(player.ghostify.annihilation.ex.div(25).plus(1).log2()+1);
    let amt = nPow(base, exp);
    return nN(amt)
}