(add-to-workspace '*ENVELOPES*)
(putprop '*ENVELOPES* "data for envelope editor in jNyqIDE" 'description)
(setf *ENVELOPES* '(
  (KICK PWLV 0.005 0.032 1 1 0)
 ))

(add-action-to-workspace 'MAKE-ENV-FUNCTIONS)
(if (fboundp 'MAKE-ENV-FUNCTIONS) (MAKE-ENV-FUNCTIONS))
(princ "workspace loaded\n")
