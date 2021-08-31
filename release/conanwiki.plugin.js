/**
 * @name conanwiki
 * @invite undefined
 * @authorLink undefined
 * @donate undefined
 * @patreon undefined
 * @website 
 * @source 
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"info":{"name":"Conanwiki","authors":[{"name":"Totto","discord_id":"234601841101373440","github_username":"Totto16"}],"version":"1.0.0","description":"Zeigt Fall ein user im Conannews.org server ist, sein wiki profil als Benutzerinfo an","github":"","github_raw":""},"main":"conanwiki.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
    const {Logger, Patcher, PluginUtilities, DOMTools, WebpackModules, DiscordAPI} = Library;
    const connectedDiv = `<div>
    <img alt="Connannews-Logo" class="connectedAccountIcon" src="https://conanwiki.org/favicon.ico">
    <div class="connectedAccountNameInner">
        <div class="connectedAccountName">
            {{placeholder}}
        </div>
        <span aria-label="Verifiziert">
            <div class="flowerStarContainer connectedAccountVerifiedIcon" style="width: 16px; height: 16px;">
            <svg class="flowerStar" aria-hidden="false" width="16" height="16" viewBox="0 0 16 15.2">
                <path fill="hsl(217, calc(var(--saturation-factor, 1) * 7.6%), 33.5%)" fill-rule="evenodd" d="m16 7.6c0 .79-1.28 1.38-1.52 2.09s.44 2 0 2.59-1.84.35-2.46.8-.79 1.84-1.54 2.09-1.67-.8-2.47-.8-1.75 1-2.47.8-.92-1.64-1.54-2.09-2-.18-2.46-.8.23-1.84 0-2.59-1.54-1.3-1.54-2.09 1.28-1.38 1.52-2.09-.44-2 0-2.59 1.85-.35 2.48-.8.78-1.84 1.53-2.12 1.67.83 2.47.83 1.75-1 2.47-.8.91 1.64 1.53 2.09 2 .18 2.46.8-.23 1.84 0 2.59 1.54 1.3 1.54 2.09z">

                </path>
            </svg>
            <div class="childContainer">
                <svg aria-hidden="false" width="16" height="16" viewBox="0 0 16 15.2">
                    <path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="hsl(0, calc(var(--saturation-factor, 1) * 0%), 100%)">

                    </path>
                </svg>
            </div>
        </div>
    </span></div>
    <a class="anchor anchorUnderlineOnHover" href="https://conanwiki.org/wiki/Benutzer:{{placeholder}}" rel="noreferrer noopener" target="_blank" role="button" tabindex="0">
        <svg class="connectedAccountOpenIcon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z">

            </path>
    <path fill="currentColor" d="M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z">

</path>
</svg></a></div>`;
    const css = ``;

    const conanewsGuildID = "392277656445648897";
    const WikiRoles = [ "432639079084064778","536414852315611137","665584545097056287", "434039051566317581"];
    //const badges = require("badges")
    const WikiRoleNames = [ "ConanWiki-Benutzer", "ConanWikinger", "ConanWiki-Kontrolleur","ConanWiki-Administrator"];
    const RoleColors =["rgb(32, 102, 148)","rgb(52, 152, 219)","rgb(155, 89, 182)","rgb(241, 196, 15)"]
    const MapNames =
    ["connectedAccount",
    "connectedAccountIcon",
    "connectedAccountNameInner",
    "connectedAccountName",
    "flowerStarContainer", "connectedAccountVerifiedIcon",
    "flowerStar",
    "childContainer",
    "anchor",
    "anchorUnderlineOnHover",
    "connectedAccountOpenIcon"];
/**example names
 * 
 * 
 *   ["connectedAccount-2Jb-Z0",
            "connectedAccountIcon-3_EQqg#",
            "connectedAccountNameInner-2q3MVf",
            "connectedAccountName-E1KzaT",
            "flowerStarContainer-3zDVtj", "connectedAccountVerifiedIcon-2cA82O",
            "flowerStar-1GeTsn",
            "childContainer-1wxZNh",
            "anchor-3Z-8B",
            "anchorUnderlineOnHover-2ESHQB",
            "connectedAccountOpenIcon-E5wGF4"]
 */
    const debugMode = false;
    const debug = (...args)=>{
        if(debugMode){
            args.forEach(arg=>Logger.debug(arg))
        }
    }
    return class ConanWikiPlugin extends Plugin {
        constructor() {
            super();
        }

        onStart() {
            PluginUtilities.addStyle(this.getName(), css);
            try{
                let guilds = DiscordAPI.guilds;
                guilds = guilds.filter(guild=>guild.id==conanewsGuildID)
                if(guilds.length>0){
                    let target = document.querySelectorAll("[class*=layerContainer]");
                    this.observer = new MutationObserver(this.userModalShow);
                    let options = {
                        childList: true,
                        attributes: true,
                        characterData: false,
                        subtree: true,
                        attributeOldValue: false,
                        characterDataOldValue: false
                    };
                    Array.from(target).forEach(element => {
                        this.observer.observe(element,options);
                    });
                    this.classes = this.getObfuscatedClasses();
                    window.ConanWikiPlugin = this;
                    this.userModalShow();
                }else{
                    Logger.info("Du musst im Conannews.org Server sein, um dieses Plugin benutzen zu können:\nhttps://discord.gg/conannews");
                }
            }catch(e){
                    Logger.error(e);
            }

        }

        userModalShow(mutationsArray){
            let target = document.querySelectorAll("[class*=focusLock]")
            if(target.length>0){
                let org_root=target[0];
                let userInfoTab = org_root.querySelectorAll('[controls=user_info-tab]')

                let tabBar = org_root.querySelectorAll('[class*=tabBar-]');
                let isSelected = false;
                if(tabBar.length<=0){
                    isSelected=true;
                }else{
                    if(userInfoTab.length<=0 && tabBar.length>0){
                        userInfoTab = org_root.querySelectorAll('[aria-controls=user_info-tab]')
                        if(userInfoTab.length<=0){
                            Logger.error("UserInfoTab nicht gefunden, wahrscheinlich ein Discord Update!")
                            return;
                        }
                    }
                    isSelected = userInfoTab[0].getAttribute("selected") == "true"
                    if(!isSelected){
                        isSelected = userInfoTab[0].getAttribute("aria-selected") == "true"
                    }
                }
                if(isSelected){
                        let section = org_root.querySelectorAll('[class*=infoScroller]')
                        if(section.length>0){
                            let userInfos = section[0].querySelectorAll('[class*=userInfoSection-]')
                            //one element in this list means, that we dont have yet a connected list, so we have to create one!
                            if(userInfos.length==1){
                                let parent = userInfos[0].parentNode;
                                let ConnR = document.createElement("div");
                                ConnR.classList.add(userInfos[0].className); //userInfoSection-q_35fn
                                ConnR.innerHTML=`<div class=${window.ConanWikiPlugin.classes.connectedAccounts}></div>` //it was connectedAccounts-QlRa4m
                                parent.appendChild(ConnR)
                                userInfos = section[0].querySelectorAll('[class*=userInfoSection-]')
                            }else if (userInfos.length<=0){
                                Logger.error("Classes changed, type=userInfo")
                                return;
                            }
                            let connectionPannel = userInfos[1].querySelectorAll('[class*=connectedAccounts]')[0]
                            
                            let name_root = org_root.querySelectorAll("[class*=nameTag-]")
                            let name = null;
                            if(name_root.length>0){
                                name = name_root[0].innerText;
                            }
                            let users = DiscordAPI.users.filter(user=>user.tag==name)
                            
                            if(users.length==1){
                                let user = users[0];
                               // Logger.debug(user)
                                //user guilds are only those, which servers you and that users a re BOTH in!
                                let guilds = user.guilds.filter(guild=>guild.id==conanewsGuildID)
                                if(guilds.length>0){
                                    let conannews = guilds[0];
                                    //Logger.debug(conannews.roles);
                                   //let roles = conannews.roles.filter(role=>role.members.filter(member=>member.userId==user.id).length>0)
                                    let roles = conannews.roles.filter(role=>WikiRoles.includes(role.id)).filter(role=>role.members.filter(member=>member.userId==user.id).length>0)
                                    if(roles.length>0){
                                        let Nickname = roles[0].members.filter(member=>member.userId==user.id)[0].nickname;
                                        if(!Nickname){
                                            Nickname=user.username;
                                        }
                                        let color = RoleColors[0];
                                        let highestRoleIndex = 0;
                                        roles.forEach(role=>{
                                            let index = WikiRoles.indexOf(role.id)
                                            highestRoleIndex = highestRoleIndex >= index ? highestRoleIndex : index;
                                            color = RoleColors[highestRoleIndex];
                                        })

                                        let Div = window.ConanWikiPlugin.createConnectedDiv(Nickname, color)
                                        if(Div){
                                            connectionPannel.appendChild(Div)
                                        }else{
                                            debug("Already exists!")
                                        }
                                    }else{
                                        debug("Only in connanews server, and not part of the wiki!")
                                    }
                                }else{
                                    debug("Not in Conannews guild");
                                }
                            }else if(users.length>1){
                                Logger.error("Found two users by tag, wtf!")
                            }else {
                                Logger.error("No user by Tag found!","Tag: "+name)
                                //maybe not in DiscordAPI.users or name not matching 
                            }
                    }else{
                        debug("Nicht im Userinfo Panel")
                    }
                }else{
                    debug("not right tab selected")
                }
            }else{
                //debug("not visible")
            }
        }

        createConnectedDiv(name,color){
            const connDiv = DOMTools.createElement(connectedDiv);
            connDiv.classList.add(window.ConanWikiPlugin.classes.map[MapNames.indexOf("connectedAccount")])
            connDiv.id = `ConanwikiPlugin-name-${name}`;
            if(document.getElementById(connDiv.id)){
                return null;
            }
            connDiv.querySelector('.anchor').href=`https://conanwiki.org/wiki/Benutzer:${name}`;
            connDiv.querySelector('.connectedAccountName').style.color = color;
            connDiv.querySelector('.connectedAccountName').innerHTML=name;
// `https://conanwiki.org/index.php?target=${name}&namespace=all&tagfilter=&start=&end=&title=Spezial:Beiträge`
            MapNames.forEach((map,index)=>{
                let replace = window.ConanWikiPlugin.classes.map[index]
                connDiv.querySelectorAll(`.${map}`).forEach(div=>{
                    div.classList.remove(map)
                    div.classList.add(replace)
                })
            })


            return connDiv;
        }

        getObfuscatedClasses(){
            let ob = {}
            let conn = WebpackModules.getByProps("connectedAccounts")
            let star = WebpackModules.getByProps("flowerStar")
            let anchor = WebpackModules.getByProps("anchorUnderlineOnHover")
            ob.connectedAccounts = conn.connectedAccounts;

            ob.map = MapNames.map(a=>{
                let cl = conn[a]
                if(!cl){
                    cl= star[a]
                }
                if(!cl){
                    cl= anchor[a]
                }
                return cl;
            })

            return ob;
        }
        onStop() {
            if(this.observer){
                this.observer.disconnect();
            }
            Patcher.unpatchAll();
        }
    };

};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/