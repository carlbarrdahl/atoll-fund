import { ImageResponse } from "next/og";
import { QRCodeSVG } from "qrcode.react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Address, erc20Abi, formatUnits, getAddress, getContract } from "viem";

import { createPublicClient, http } from "viem";
import { baseSepolia, hardhat, mainnet } from "viem/chains";
import { contracts } from "~/config";

import { getProjectDetails } from "~/hooks/use-project-details";
import ProjectABI from "~/abi/Project.json";
import { Metadata } from "~/schemas/metadata";
import { stripMarkdown } from "~/lib/utils";
import { formatNumber } from "~/lib/format";

const title = "Atoll";
export const alt = title;
export const size = { width: 1200, height: 630 };

export const contentType = "image/png";
function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

export default async function Image(props: {
  params: { projectAddress: Address };
}) {
  try {
    const { projectAddress } = props.params;
    // const project = {
    //   metadata: {
    //     title: "Project",
    //   },
    // };
    const contract = getContract({
      address: projectAddress,
      abi: ProjectABI,
      client: publicClient,
    });

    const details = getProjectDetails(await contract.read.getProjectDetails());
    const tokenContract = getContract({
      address: details?.tokenAddress as Address,
      abi: erc20Abi,
      client: publicClient,
    });

    const [symbol, decimals] = await Promise.all([
      tokenContract.read.symbol(),
      tokenContract.read.decimals(),
    ]);
    const metadata = await fetch(details?.projectMetadata).then((r) =>
      r.json(),
    );
    console.log(details);
    console.log(metadata);

    const totalFundsRaised = formatNumber(
      formatUnits(details?.totalFundsRaised, decimals),
    );
    const fundingTarget = formatNumber(
      formatUnits(details?.fundingTarget, decimals),
    );
    const progress = (details.totalFundsRaised / details.fundingTarget) * 100;

    console.log({ totalFundsRaised, fundingTarget });
    const projectUrl = `${getBaseUrl()}/projects/${projectAddress}`;
    return new ImageResponse(
      (
        <div tw="bg-white w-full h-full flex flex-col justify-center items-center">
          <div tw="flex flex-col items-center">
            <div tw="text-[56px] text-gray-900 text-center mb-2">
              {metadata?.title}
            </div>
            <div tw="flex ">
              Funding until:{" "}
              {format(new Date(details?.fundingDeadline), "PP HH:mm")}
            </div>
            {/* <div tw="flex max-w-[200px]  mt-8">
              <div tw="flex relative left-0 h-2 w-full overflow-hidden rounded-full bg-neutral-900/20 dark:bg-neutral-50/20">
                <div
                  tw="h-full w-full flex-1 bg-neutral-900 transition-all dark:bg-neutral-50"
                  style={{
                    transform: `translateX(-${100 - (progress || 0)}%)`,
                  }}
                ></div>
              </div>
            </div> */}
            <div tw="flex">
              <span>
                {" "}
                {totalFundsRaised} {" / "} {fundingTarget} {symbol}
              </span>
            </div>

            <div
              tw="flex text-lg mb-6 text-gray-900 max-w-[800px]"
              style={{ lineHeight: 1.3 }}
            >
              <span>
                {stripMarkdown(metadata?.description?.slice(0, 270))}...
              </span>
            </div>
          </div>

          <div tw="flex bg-white p-2 rounded mb-2 border-2 border-gray-200">
            <QRCodeSVG size={200} value={projectUrl} />
          </div>
          <div tw="flex bg-gray-900 text-white w-[214px] p-2 rounded shadow-xl justify-center font-semibold  mb-4">
            Scan to fund
          </div>
        </div>
      ),
      { ...size },
    );
  } catch (error) {
    console.error(error);

    return notFound();
  }
}
