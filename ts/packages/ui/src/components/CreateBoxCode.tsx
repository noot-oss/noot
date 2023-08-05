// "use client";
//
// // Unused component
// // TODO: Split into multiple components
//
// import {
//   createRef,
//   type Dispatch,
//   type SetStateAction,
//   useCallback,
//   useEffect,
//   useState,
// } from "react";
// import { z } from "zod";
// import { api } from "~/utils/api";
//
// const CODEINPUT_LENGTH = 9;
//
// const codeSchema = z.object({
//   code: z
//     .string()
//     .min(CODEINPUT_LENGTH - 1)
//     .max(CODEINPUT_LENGTH - 1),
// });
//
// interface CodeInputProps {
//   code: string[];
//   setCode: Dispatch<SetStateAction<string[]>>;
//   isValid: boolean;
// }
//
// const CodeInput = (props: CodeInputProps) => {
//   const [refs, setRefs] = useState<React.RefObject<HTMLInputElement>[]>([]);
//
//   useEffect(() => {
//     Array.from({ length: CODEINPUT_LENGTH }).forEach(() => {
//       setRefs((refs) => [...refs, createRef()]);
//     });
//   }, []);
//
//   return (
//     <div className={"grid grid-cols-9 gap-8"}>
//       {Array.from({ length: CODEINPUT_LENGTH }).map((_, i) => {
//         if (i === 4)
//           return (
//             <div
//               className={"mx-auto w-1 rounded-full bg-white/50"}
//               key={`codeInput-${i}`}
//             ></div>
//           );
//
//         return (
//           <Input
//             key={`codeInput-${i}`}
//             type="number"
//             min="0"
//             max="10"
//             pattern={"[0-9]*"}
//             size={"lg"}
//             validationState={props.isValid ? "valid" : "invalid"}
//             classNames={{
//               input: "text-center text-4xl font-bold",
//               inputWrapper: "w-16 h-32",
//             }}
//             variant={"bordered"}
//             ref={refs[i]}
//             placeholder={"0"}
//             value={props.code[i] ?? "0"}
//             onKeyDown={(e) => {
//               if (e.key !== "Tab") {
//                 e.preventDefault();
//               }
//
//               if (e.key.match(/[0-9]/)) {
//                 props.setCode((prev) => {
//                   return prev.map((v, index) => {
//                     if (index === i) {
//                       return e.key;
//                     } else {
//                       return v;
//                     }
//                   });
//                 });
//
//                 if (i > CODEINPUT_LENGTH - 1) return;
//
//                 if (i === 3) {
//                   return refs[i + 2]?.current?.focus();
//                 }
//                 return refs[i + 1]?.current?.focus();
//               }
//
//               if (e.key === "Backspace") {
//                 props.setCode((prev) => {
//                   return prev.map((v, index) => {
//                     if (index === i) {
//                       return "";
//                     } else {
//                       return v;
//                     }
//                   });
//                 });
//
//                 if (i === 0) return;
//                 if (i === 5) {
//                   return refs[i - 2]?.current?.focus();
//                 }
//                 return refs[i - 1]?.current?.focus();
//               }
//             }}
//           />
//         );
//       })}
//     </div>
//   );
// };
//
// export const CreateBoxCode = () => {
//   const [code, setCode] = useState<string[]>(
//     Array.from({ length: CODEINPUT_LENGTH })
//   );
//   const [isValid, setIsValid] = useState(true);
//   const [submitAttempted, setSubmitAttempted] = useState(false);
//   const [buttonDisabled, setButtonDisabled] = useState(false);
//   const { error, refetch, isFetching } = {
//     error: null,
//     refetch: async () => {},
//     isFetching: false,
//   };
//
//   useEffect(() => {
//     if (submitAttempted) {
//       setIsValid(codeSchema.safeParse({ code: code.join("") }).success);
//       setButtonDisabled(false);
//     }
//   }, [code, submitAttempted]);
//
//   const handleContinueButtonClick = useCallback(async () => {
//     setSubmitAttempted(true);
//
//     if (!isValid || code.join("") === "") return;
//     setButtonDisabled(true);
//     void (await refetch());
//   }, [code, isValid, refetch]);
//
//   return (
//     <div className="mt-8 flex flex-col gap-8 lg:mt-32">
//       <h2 className="text-2xl">Enter Box Code</h2>
//
//       <CodeInput code={code} setCode={setCode} isValid={isValid} />
//
//       <Button
//         variant="solid"
//         size="lg"
//         color="primary"
//         isDisabled={buttonDisabled}
//         onPress={() => void handleContinueButtonClick()}
//         isLoading={isFetching}
//       >
//         Continue
//       </Button>
//       {error?.message === "NOT_FOUND" && (
//         <div className="mx-auto text-center text-2xl font-bold text-red-500">
//           We couldn{"'"}t find a box with that code, please ensure codes are
//           matching!
//         </div>
//       )}
//       {error?.message === "TOO_MANY_REQUESTS" && (
//         <div className="mx-auto text-center text-2xl font-bold text-red-500">
//           Too many requests, please try again later!
//         </div>
//       )}
//     </div>
//   );
// };
