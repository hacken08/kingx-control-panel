"use client";

import UserManagementCreateAccount from "@/components/drawer/UserManagementCreateAccount";
import UserManagementAccountDetails from "@/components/drawer/UserManagementAccountDetails";
import { poppins } from "@/utils/fonts";
import { Icon } from "@iconify/react";
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  MenuProps,
  Select,
  Space,
  Table,
  TableProps,
} from "antd";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ApiCall, ApiRespose } from "@/lib/api";
import { toast } from "react-toastify";
import { formateDate } from "@/lib/methods";

export interface UserDataType {
  id: string | number; // TODO: remove number according to requirement
  username: string;
  role: string;
  wallet: number;
  createdAt: string;
  phone_number: string;
}

export default function Page() {
  const [accountCreateOpen, setAccountCreateOpen] = useState(false);
  const [accountManageOpen, setAccountManageOpen] = useState(false);
  const [userData, setUserData] = useState<UserDataType[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<undefined | UserDataType>();

  const perPageData = 10;

  const t = useTranslations("UserManagement");

  // Fetch ALl Users
  const userQuery = useQuery({
    queryKey: ["GetAllUser", page],
    queryFn: async () => {
      const response: ApiRespose = await ApiCall({
        query: `query ($skip: Int!, $take: Int!) {
            getAllUsers(skip: $skip, take: $take) {
              count,
              skip,
              take,
              data {
                id,
                username,
                role,
                wallet,
                createdAt,
                phone_number
              }
            }
          }`,
        variables: {
          skip: (page - 1) * perPageData,
          take: perPageData,
        },
      });
      
      if (!response.status) {
        toast.error(response.message);
        return [];
      }
      const apiData: {
        count: number;
        data: UserDataType[];
        take: number;
        skip: number;
      } = response.data?.getAllUsers;

      setCount(apiData.count);
      setUserData(apiData?.data ?? []);

      return apiData?.data ?? [];
    },
  });

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: t("Removeuser"),
    },
    {
      key: "2",
      label: <span className="text-red-500">Block this user</span>,
    },
  ];

  const columns: TableProps<UserDataType>["columns"] = [
    {
      title: "Username",
      dataIndex: "username",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Token",
      dataIndex: "wallet",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "createdAt",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {formateDate(new Date(d))}
        </div>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      render: (d, user) => (
        <div
          onClick={() => {
            setSelectedUser(user);
            setAccountManageOpen(true);
          }}
        >
          {d}
        </div>
      ),
    },
    {
      title: "",
      key: "username",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          placement="bottomRight"
          transitionName=""
        >
          <Space size="middle">
            <Icon
              icon="material-symbols:more-vert"
              className="cursor-pointer"
            />
          </Space>
        </Dropdown>
      ),
    },
  ];
  return (
    <div>
      {/* Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-4 items-center w-full">
        <Input
          placeholder="Search"
          style={{ width: 240 }}
          // onChange={handleChange} TODO: what to do on change
          className="border-transparent focus-within:border-primary"
          prefix={<Icon icon="mdi-light:magnify" />}
        />
        <Select
          placeholder="Role"
          style={{ width: 240 }}
          // onChange={handleChange} TODO: what to do on select
          options={[
            { value: "super_admin", label: "SUPER ADMIN" },
            { value: "admin", label: "ADMIN" },
            { value: "user", label: "USER" },
          ]}
          className="border-transparent"
        />
        <DatePicker
          style={{ width: 240 }}
          // onChange={onChange} TODO: what to do on change
          needConfirm={true}
          placeholder="Date"
        />

        <div className="hidden xl:block flex-1"></div>

        <Button
          type="primary"
          className={`rounded-xl text ${poppins} text-base w-60 `}
          icon={<Icon icon="material-symbols:add-circle-outline-rounded" />}
          onClick={() => {
            setAccountCreateOpen(true);
          }}
        >
          Create Account
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-scroll">
        <Table<UserDataType>
          columns={columns}
          dataSource={userData}
          rowKey="username"
          pagination={{
            pageSize: perPageData,
            total: count,
            onChange: (page) => {
              setPage(page);
            },
          }}
        />
      </div>

      {/* Drawers */}
      <UserManagementCreateAccount
        open={accountCreateOpen}
        setOpen={setAccountCreateOpen}
      />
      <UserManagementAccountDetails
        open={accountManageOpen}
        setOpen={setAccountManageOpen}
        selectedUser={selectedUser}
      />
    </div>
  );
}
