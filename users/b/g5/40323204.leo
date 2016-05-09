t: Installed, hotpatch status: DisabledBecauseNoHotpatchPackagesInitiated, status: 0x0, failure source: Not Applicable, reboot required: True, client id: WindowsUpdateAgent, initiated offline: False, execution sequence: 895, first merged sequence: 853
2016-02-02 11:05:36, Info                  CBS    SQM: Upload requested for report: PackageChangeBegin_Package_for_KB3042553~31bf3856ad364e35~amd64~~6.1.1.1, session id: 142859, sample type: Standard
2016-02-02 11:05:36, Info                  CBS    SQM: Ignoring upload request because the sample type is not enabled: Standard
2016-02-02 11:05:36, Info                  CBS    Restored system sleep block state: 0x80000000
2016-02-02 11:05:37, Info                  CBS    Exec: Processing complete.  Session: 30498150_2328024035, Package: Package_for_KB3042553~31bf3856ad364e35~amd64~~6.1.1.1 [HRESULT = 0x00000000 - S_OK]
2016-02-02 11:07:12, Info                  CBS    Session: 30498150_3487262071 initialized by client WindowsUpdateAgent.
2016-02-02 11:07:12, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-WinPE-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:07:12, Info                  CBS    Appl: detectParent: package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, no parent found, go absent
2016-02-02 11:07:12, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:07:12, Info                  CBS    Appl: detectParent: package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, parent found: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, state: Installed
2016-02-02 11:07:12, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, disposition state from detectParent: Installed
2016-02-02 11:07:12, Info                  CBS    Appl: Evaluating package applicability for package Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, applicable state: Installed
2016-02-02 11:07:12, Info                  CBS    Exec: Asynchrous operation, session completes later
2016-02-02 11:07:12, Info                  CBS    Blocked system sleep; prior state: 0x80000000
2016-02-02 11:07:12, Info                  CBS    Asynchronous Session: 30498150_3487262071 finalized. [HRESULT = 0x00000000 - S_OK]
2016-02-02 11:07:12, Info                  CBS    Exec: Processing started.  Client: WindowsUpdateAgent, Session: 30498150_3487262071, Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0
2016-02-02 11:07:13, Info                  CBS    Exec: Using execution sequence: 897
2016-02-02 11:07:13, Info                  CBS    Disabling LKG boot option
2016-02-02 11:07:13, Info                  CBS    Client specifies CbsMovePayload, or client is Windows Update, will move payload to system.
2016-02-02 11:07:13, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-WinPE-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:07:13, Info                  CBS    Appl: detectParent: package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, no parent found, go absent
2016-02-02 11:07:13, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:07:13, Info                  CBS    Appl: detectParent: package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, parent found: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, state: Installed
2016-02-02 11:07:13, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, disposition state from detectParent: Installed
2016-02-02 11:07:13, Info                  CBS    Appl: Evaluating package applicability for package Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, applicable state: Installed
2016-02-02 11:07:13, Info                  CBS    Plan: Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, current: Resolved, pending: Default, start: Resolved, applicable: Installed, targeted: Installed, limit: Installed
2016-02-02 11:07:13, Info                  CBS    Plan: Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-10_neutral_PACKAGE, current: Absent, pending: Default, start: Absent, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:07:13, Info                  CBS    Plan: Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-11_neutral_PACKAGE, current: Resolved, pending: Default, start: Resolved, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:07:14, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476_RTM~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-WinPE-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:07:14, Info                  CBS    Appl: detectParent: package: Package_for_KB3054476_RTM~31bf3856ad364e35~amd64~~6.1.1.0, no parent found, go absent
2016-02-02 11:07:14, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476_RTM~31bf3856ad364e35~amd64~~6.1.1.0, disposition state from detectParent: Absent
2016-02-02 11:07:14, Info                  CBS    Appl: Evaluating package applicability for package Package_for_KB3054476_RTM~31bf3856ad364e35~amd64~~6.1.1.0, applicable state: Absent
2016-02-02 11:07:14, Info                  CBS    Plan: Skipping package since its start state and target state are both absent for package: Package_for_KB3054476_RTM~31bf3856ad364e35~amd64~~6.1.1.0, current: Absent, pending: Default, start: Absent, applicable: Absent, targeted: Absent, limit: Installed
2016-02-02 11:07:14, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-EmbeddedCore-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Staged, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:07:14, Info                  CBS    Appl: detectParent: package: Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0, no parent found, go absent
2016-02-02 11:07:14, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Staged, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:07:14, Info                  CBS    Appl: detectParent: package: Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0, parent found: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, state: Installed
2016-02-02 11:07:14, Info                  CBS    Appl: detect Parent, Package: Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0, disposition state from detectParent: Installed
2016-02-02 11:07:14, Info                  CBS    Appl: Evaluating package applicability for package Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0, applicable state: Installed
2016-02-02 11:07:14, Info                  CBS    Plan: Package: Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0, current: Resolved, pending: Default, start: Resolved, applicable: Installed, targeted: Installed, limit: Installed
2016-02-02 11:07:14, Info                  CBS    Plan: Package: Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-8_neutral_PACKAGE, current: Resolved, pending: Default, start: Resolved, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:07:14, Info                  CBS    Plan: Package: Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-9_neutral_PACKAGE, current: Absent, pending: Default, start: Absent, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:07:14, Info                  CBS    Appl: detect Parent, Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:07:14, Info                  CBS    Appl: detectParent: package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, parent found: Microsoft-Windows-Foundation-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, state: Installed
2016-02-02 11:07:14, Info                  CBS    Appl: detect Parent, Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, disposition state from detectParent: Installed
2016-02-02 11:07:14, Info                  CBS    Appl: Evaluating package applicability for package Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, applicable state: Installed
2016-02-02 11:07:14, Info                  CBS    Plan: Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, current: Resolved, pending: Default, start: Resolved, applicable: Installed, targeted: Installed, limit: Installed
2016-02-02 11:07:14, Info                  CSI    0000100f Transaction merge required, do-not-merge flag passed.
2016-02-02 11:07:14, Info                  CSI    00001010@2016/2/2:03:07:14.152 CSI Transaction @0x23db9230 initialized for deployment engine {d16d444c-56d8-11d5-882d-0080c847b195} with flags 00000002 and client id [26]"TI5.30498150_3487262071:1/"

2016-02-02 11:07:17, Info                  CSI    00001011@2016/2/2:03:07:17.147 CSI Transaction @0x23db9230 destroyed
2016-02-02 11:07:17, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-streamclass_31bf3856ad364e35_0.0.0.0_none_de5d26e2382a5ce8 (6.1.7601.23033), elevation:2, lower version revision holder: 6.1.7600.16385
2016-02-02 11:07:17, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-streamclass_31bf3856ad364e35_6.1.7601.23033_none_bcfd5ed567713c6a, elevate: 2, applicable(true/false): 0
2016-02-02 11:07:17, Info                  CBS    Appl: SelfUpdate detect, component: amd64_microsoft-windows-streamclass_31bf3856ad364e35_6.1.7601.23033_none_bcfd5ed567713c6a, elevation: 2, applicable: 0
2016-02-02 11:07:17, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: NotApplicable, result applicability state: Staged
2016-02-02 11:07:17, Info                  CBS    Appl: Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-3_neutral_LDR, Applicable: NotApplicable, Disposition: Staged
2016-02-02 11:07:17, Info                  CBS    Plan: Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-3_neutral_LDR, current: Resolved, pending: Default, start: Resolved, applicable: Staged, targeted: Staged, limit: Installed, selected: Default
2016-02-02 11:07:17, Info                  CBS    Appl: Selfupdate, Component: amd64_microsoft-windows-streamclass_31bf3856ad364e35_0.0.0.0_none_de5d26e2382a5ce8 (6.1.7601.18828), elevation:16, lower version revision holder: 6.1.7600.16385
2016-02-02 11:07:17, Info                  CBS    Applicability(ComponentAnalyzerEvaluateSelfUpdate): Component: amd64_microsoft-windows-streamclass_31bf3856ad364e35_6.1.7601.18828_none_bc83bb464e46cc20, elevate: 16, applicable(true/false): 1
2016-02-02 11:07:17, Info                  CBS    Appl: SelfUpdate detect, component: amd64_microsoft-windows-streamclass_31bf3856ad364e35_6.1.7601.18828_none_bc83bb464e46cc20, elevation: 16, applicable: 1
2016-02-02 11:07:17, Info                  CBS    Appl: Evaluating applicability block(non detectUpdate part), disposition is: Staged, applicability: Applicable, result applicability state: Installed
2016-02-02 11:07:17, Info                  CBS    Appl: Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-4_neutral_GDR, Applicable: Applicable, Disposition: Installed
2016-02-02 11:07:17, Info                  CBS    Plan: Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-4_neutral_GDR, current: Resolved, pending: Default, start: Resolved, applicable: Installed, targeted: Installed, limit: Installed, selected: Default
2016-02-02 11:07:17, Info                  CBS    Appl: detect Parent, Package: Package_3_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Parent: Microsoft-Windows-EmbeddedCore-Package~31bf3856ad364e35~amd64~~6.1.7601.17514, Disposition = Detect, VersionComp: EQ, ServiceComp: EQ, BuildComp: EQ, DistributionComp: GE, RevisionComp: GE, Exist: present
2016-02-02 11:07:17, Info                  CBS    Appl: detectParent: package: Package_3_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, no parent found, go absent
2016-02-02 11:07:17, Info                  CBS    Appl: detect Parent, Package: Package_3_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, disposition state from detectParent: Absent
2016-02-02 11:07:17, Info                  CBS    Appl: Evaluating package applicability for package Package_3_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, applicable state: Absent
2016-02-02 11:07:17, Info                  CBS    Plan: Skipping package since its start state and target state are both absent for package: Package_3_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, current: Absent, pending: Default, start: Absent, applicable: Absent, targeted: Absent, limit: Installed
2016-02-02 11:07:17, Info                  CBS    Perf: Resolve chain started.
2016-02-02 11:07:17, Info                  CSI    00001012 Transaction merge required, do-not-merge flag passed.
2016-02-02 11:07:17, Info                  CSI    00001013@2016/2/2:03:07:17.209 CSI Transaction @0x23db9230 initialized for deployment engine {d16d444c-56d8-11d5-882d-0080c847b195} with flags 00000002 and client id [79]"TI1.30498150_3487262071:2/Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0"

2016-02-02 11:07:17, Info                  CSI    00001014@2016/2/2:03:07:17.209 CSI Transaction @0x23db9230 destroyed
2016-02-02 11:07:17, Info                  CBS    Perf: Resolve chain complete.
2016-02-02 11:07:17, Info                  CBS    Perf: Stage chain started.
2016-02-02 11:07:17, Info                  CSI    00001015 Transaction merge required, do-not-merge flag passed.
2016-02-02 11:07:17, Info                  CSI    00001016@2016/2/2:03:07:17.209 CSI Transaction @0x23db9230 initialized for deployment engine {d16d444c-56d8-11d5-882d-0080c847b195} with flags 00000002 and client id [65]"TI2.0_0:0/Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0"

2016-02-02 11:07:17, Info                  CBS    Exec: Staging Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-3_neutral_LDR
2016-02-02 11:07:17, Info                  CBS    Exec: Staging Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-3_neutral_LDR, PinDeployment: amd64_7aa8da28bc197c4fcb34e780e0da8fc0_31bf3856ad364e35_6.1.7601.23033_none_978dcad07da2c9c5
2016-02-02 11:07:17, Info                  CBS    Exec: Staging Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-4_neutral_GDR
2016-02-02 11:07:17, Info                  CBS    Exec: Staging Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-4_neutral_GDR, PinDeployment: amd64_12af54d33ce84cba6bae1ae32cebf547_31bf3856ad364e35_6.1.7601.18828_none_2d32cc43f0ac909c
2016-02-02 11:07:17, Info                  CSI    00001017@2016/2/2:03:07:17.225 CSI Transaction @0x23db9230 destroyed
2016-02-02 11:07:17, Info                  CSI    00001018 Transaction merge required, do-not-merge flag passed.
2016-02-02 11:07:17, Info                  CSI    00001019@2016/2/2:03:07:17.225 CSI Transaction @0x23db9230 initialized for deployment engine {d16d444c-56d8-11d5-882d-0080c847b195} with flags 00000002 and client id [79]"TI3.30498150_3487262071:3/Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0"

2016-02-02 11:07:20, Info                  CSI    0000101a Performing 2 operations; 2 are not lock/unlock and follow:
  StageFile (2): flags: 8 app: (null) comp: Microsoft-Windows-StreamClass, Version = 6.1.7601.23033, pA = PROCESSOR_ARCHITECTURE_AMD64 (9), Culture neutral, VersionScope = 1 nonSxS, PublicKeyToken = {l:8 b:31bf3856ad364e35}, Type neutral, TypeName neutral, PublicKey neutral file: [ml:22{11},l:20{10}]"stream.sys" srcfile: @0x21281e68
  StageFile (2): flags: 8 app: (null) comp: Microsoft-Windows-StreamClass, Version = 6.1.7601.18828, pA = PROCESSOR_ARCHITECTURE_AMD64 (9), Culture neutral, VersionScope = 1 nonSxS, PublicKeyToken = {l:8 b:31bf3856ad364e35}, Type neutral, TypeName neutral, PublicKey neutral file: [ml:22{11},l:20{10}]"stream.sys" srcfile: @0x21268458
2016-02-02 11:07:20, Info                  CSI    0000101b@2016/2/2:03:07:20.126 CSI Transaction @0x23db9230 destroyed
2016-02-02 11:07:20, Info                  CBS    Perf: Stage chain complete.
2016-02-02 11:07:20, Info                  CBS    Perf: Execute chain started.
2016-02-02 11:07:20, Info                  CBS    Exec: Not trying hotpatching because root package is not hotpatch-aware: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0
2016-02-02 11:07:20, Info                  CSI    0000101c Transaction merge required, do-not-merge flag passed.
2016-02-02 11:07:20, Info                  CSI    0000101d@2016/2/2:03:07:20.126 CSI Transaction @0x23db9230 initialized for deployment engine {d16d444c-56d8-11d5-882d-0080c847b195} with flags 00000002 and client id [79]"TI4.30498150_3487262071:4/Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0"

2016-02-02 11:07:22, Info                  CBS    Exec: Installing Package: Package_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0
2016-02-02 11:07:22, Info                  CBS    Exec: Installing Package: Package_for_KB3054476_SP1~31bf3856ad364e35~amd64~~6.1.1.0
2016-02-02 11:07:22, Info                  CBS    Exec: Installing Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0
2016-02-02 11:07:22, Info                  CBS    Exec: Skipping Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64~~6.1.1.0, Update: 3054476-3_neutral_LDR because it is already in the correct state.
2016-02-02 11:07:22, Info                  CBS    Exec: Installing Package: Package_2_for_KB3054476~31bf3856ad364e35~amd64