module.exports = (Plugin, Library) => {
    const {Logger, Patcher, PluginUtilities, DOMTools, WebpackModules, DiscordAPI} = Library;
    const connectedDiv = require("connected.html");
    const css = require("styles.css");

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
    const debugMode = true;
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