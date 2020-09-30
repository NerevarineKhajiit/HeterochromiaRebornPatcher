︴﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋︴
︴ Using the Heterochromia UPF Patcher ︴
︴﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏︴

︴﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋
︴Setting up the patcher:
︴1	If you don’t already have it, download zEdit by mator and extract it somewhere.
︴	o	https://github.com/z-edit/zedit/releases 
︴2	Run zEdit.exe
︴3	Up in the upper right corner, by the X and so forth, click on the icon that looks like 3 stacked cubes.
︴4	Select “Install Module”
︴5	Navigate to wherever you put my UPF patcher download and select the HeterochromiaRebornPatcher.zip
︴6	You can now run the patcher
︴﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

︴﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋﹋
︴Running the patcher:
︴1	Choose SSE in zEdit’s main page, and hit Start Session. It’ll ask you which plugins you want to load. 
︴	o	By default it will have all of the mods in your load order selected; any that aren’t active in your load order will be deselected. 
︴	o	I recommend for the purposes of using my mod to only load in the Skyrim and DLC .esm files and any eye mods you want to patch. 
︴	o	Eye textures will be added to the Left and Right eye sliders in the same order that they appear in your Load order.
︴2	Once zEdit is done loading the plugins, there should be an icon in the upper right corner that looks like a Puzzle piece. Click on it. 
︴	o	It will show you all of the plugins you have installed and list them in the lefthand column. 
︴3	If you want to tweak the settings for my patcher, this is when to do it. I have 3 available settings currently. 
︴	o	The first setting is checked on by default – this is what will remove Vanilla headpart records from the vanilla Eye Color slider.
︴		 Makes it easier to avoid having overlapping eyes. You can turn this off if you want.
︴		 You’ll just need to manually select my Blank Eyes record in the vanilla slider before using my Left/Right sliders in-game. 
︴		 I primarily made this option for 2 use cases: 
︴		 A) Those who don’t like their character starting out with empty eye sockets
︴		 B) Those who want to make a plugin addon that’s meant to run alongside my main file so that you can distribute it with a Follower/NPC mod or similar.
︴	o	The second setting is off by default – this is what will remove Modded headpart records from the vanilla Eye Color slider. 
︴		 I have this defaulted to being off because running it like this will allow you to just disable the .esp file of the original mod when you’re done patching.
︴		 This saves on plugin space. 
︴		 If you need to leave the mod in your load order for something like a Follower mod, or if the mod does more than just add eyes, check this box before patching.
︴	o	The third is also off by default – this is what determines if the patcher will ignore the vanilla texture set records in the resulting patch. 
︴		 This option is exclusively intended for use in creating a plugin addon that is intended to run alongside my main file.
︴		 This is so that you can distribute it with a Follower/NPC mod or similar. 
︴		 Because the patcher has variable record ID values based on how many eye textures you feed it, it is difficult to make another mod depend on my patch.
︴		 By turning off the first and third settings options on my patcher, you’ll get a plugin file that doesn’t reference vanilla records at all
︴		 It will only reference whatever mod-added textures you put in, in essence allowing you to make your own Heterochromia-ified version of a specific eye mod.
︴		 It will still require my Racemenu .ini files to work. 
︴		 In this manner, you can create a plugin and guarantee a static record ID value for the eye records within it, which you can then refer to in another mod.
︴		 For example, an NPC overhaul mod or a Follower mod where you want the NPCs to use Heterochromia eyes. 
︴		 The idea is that you would rename this specific plugin and run it alongside a normally-patched version of Heterochromia Reborn. 
︴		 I’ll admit that I haven’t thoroughly tested this idea as I’m not quite familiar yet with making NPCs – let me know if this doesn’t actually work as I've described.
︴4	Select “Build Patches” in the lefthand column, and then click the blue “Build” button next to the Heterochromia Reborn entry in the middle panel.
︴5	It will take some time to patch depending on how many eye textures it needs to process. 
︴	o	Processing against vanilla textures only takes a few seconds, but processing against a few hundred mod-added textures will take a few minutes.
︴	o	You will probably notice the progress meter will get stuck around 1%-4% (depending on how many textures you’re processing). 
︴		 This is normal – I didn’t bother to code in manual progress meter updating so all of the headpart generation and so forth all occurs in the same ‘step’
︴		 If you’re worried about it hanging, you can click on the little dropdown arrow to see all the Log reports my patcher will output for each texture. 
︴		 This is also handy for making sure you got the right number of textures, as the Log will tell you at the end of patching how many textures got processed.
︴6	Once it’s done, you can close the patcher progress window and you’ll see the new plugin in the lefthand sidebar with its name in Bold to show you that it’s new. 
︴	o	If you’re familiar with Skyrim records you can poke around inside the plugin to see the headparts and texture sets it made if you want. 
︴	o	To actually save the plugin and make it available in your Data folder, close out of zEdit and it will ask you if you want to save or discard the plugin. 
︴7	Make sure you enable the new plugin and sort your load order with your modding tool of choice.
︴8	Load the game and look at all your new texture options!
︴﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

Please let me know in the comments on my modpage if you need clarification on any of this, or if you think some of the instructions could be written more clearly. 
Thanks for reading!

Cheers,
~NK_
