"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  productSchema,
  customerSchema,
  expenseSchema,
  employeeSchema,
  type ProductInput,
  type CustomerInput,
  type ExpenseInput,
  type EmployeeInput,
} from "@/lib/data-schemas";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createCustomer,
  createExpense,
  createEmployee,
} from "@/actions/data";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const selectClass =
  "flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ProductDialog({
  categories,
  product,
  open,
  onOpenChange,
  trigger,
}: {
  categories: { id: string; name: string }[];
  product?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    cost?: number | null;
    stock: number;
    lowStockAt?: number | null;
    categoryId?: string | null;
  };
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const isEdit = !!product;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    else setInternalOpen(v);
  };
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          price: product.price,
          cost: product.cost ?? 0,
          stock: product.stock,
          lowStockAt: product.lowStockAt ?? 10,
          categoryId: product.categoryId ?? "",
        }
      : { name: "", sku: "", price: 0, stock: 0, lowStockAt: 10 },
  });

  React.useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        price: product.price,
        cost: product.cost ?? 0,
        stock: product.stock,
        lowStockAt: product.lowStockAt ?? 10,
        categoryId: product.categoryId ?? "",
      });
    }
  }, [product, reset]);

  async function onSubmit(v: ProductInput) {
    setError(null);
    const res = isEdit
      ? await updateProduct(product!.id, v)
      : await createProduct(v);
    if (res?.error) setError(res.error);
    else {
      setOpen(false);
      toast.success(isEdit ? "Product updated" : "Product created");
      router.refresh();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update this item's details." : "Add an item to your inventory."}</DialogDescription>
        </DialogHeader>
        {error && <Alert variant="error">{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Name" error={errors.name?.message}><Input placeholder="Wireless Earbuds" {...register("name")} /></Field>
          <Field label="SKU" error={errors.sku?.message}><Input placeholder="WE-001" {...register("sku")} /></Field>
          <Field label="Category">
            <select className={selectClass} {...register("categoryId")} defaultValue="">
              <option value="">Uncategorized</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" error={errors.price?.message}><Input type="number" step="0.01" {...register("price")} /></Field>
            <Field label="Cost"><Input type="number" step="0.01" {...register("cost")} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock" error={errors.stock?.message}><Input type="number" {...register("stock")} /></Field>
            <Field label="Low stock at"><Input type="number" {...register("lowStockAt")} /></Field>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function InventoryActions({
  product,
  categories,
}: {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    cost?: number | null;
    stock: number;
    lowStockAt?: number | null;
    categoryId?: string | null;
  };
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  async function onDelete() {
    setBusy(true);
    const res = await deleteProduct(product.id);
    setBusy(false);
    setConfirm(false);
    if (res?.error) toast.error(res.error);
    else { toast.success("Product deleted"); router.refresh(); }
  }

  return (
    <div className="flex justify-end gap-1">
      <ProductDialog
        categories={categories}
        product={product}
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button variant="ghost" size="icon" aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Delete"
        className="text-destructive"
        onClick={() => setConfirm(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              This will permanently remove <span className="font-medium">{product.name}</span>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={onDelete} disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CustomerDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  async function onSubmit(v: CustomerInput) {
    setError(null);
    const res = await createCustomer(v);
    if (res?.error) setError(res.error);
    else { setOpen(false); router.refresh(); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm"><Plus className="h-4 w-4" /> Add customer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New customer</DialogTitle>
          <DialogDescription>Add a customer to your CRM.</DialogDescription>
        </DialogHeader>
        {error && <Alert variant="error">{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Name" error={errors.name?.message}><Input placeholder="Acme Corp" {...register("name")} /></Field>
          <Field label="Email" error={errors.email?.message}><Input type="email" placeholder="contact@acme.com" {...register("email")} /></Field>
          <Field label="Phone"><Input placeholder="+1 555 000 0000" {...register("phone")} /></Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Create customer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ExpenseDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { description: "", amount: 0, category: "OTHER" },
  });

  async function onSubmit(v: ExpenseInput) {
    setError(null);
    const res = await createExpense(v);
    if (res?.error) setError(res.error);
    else { setOpen(false); router.refresh(); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm"><Plus className="h-4 w-4" /> Add expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New expense</DialogTitle>
          <DialogDescription>Record a business expense.</DialogDescription>
        </DialogHeader>
        {error && <Alert variant="error">{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Description" error={errors.description?.message}><Input placeholder="Office rent" {...register("description")} /></Field>
          <Field label="Amount" error={errors.amount?.message}><Input type="number" step="0.01" {...register("amount")} /></Field>
          <Field label="Category" error={errors.category?.message}>
            <select className={selectClass} {...register("category")} defaultValue="OTHER">
              {["RENT", "SALARIES", "MARKETING", "UTILITIES", "SOFTWARE", "TRAVEL", "OTHER"].map((c) => (
                <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Add expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EmployeeDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: "", email: "", phone: "", position: "", salary: 0 },
  });

  async function onSubmit(v: EmployeeInput) {
    setError(null);
    const res = await createEmployee(v);
    if (res?.error) setError(res.error);
    else { setOpen(false); router.refresh(); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm"><Plus className="h-4 w-4" /> Add employee</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New employee</DialogTitle>
          <DialogDescription>Add a team member.</DialogDescription>
        </DialogHeader>
        {error && <Alert variant="error">{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Name" error={errors.name?.message}><Input placeholder="Jordan Lee" {...register("name")} /></Field>
          <Field label="Position"><Input placeholder="Operations Manager" {...register("position")} /></Field>
          <Field label="Email"><Input type="email" placeholder="jordan@company.com" {...register("email")} /></Field>
          <Field label="Phone"><Input placeholder="+1 555 000 0000" {...register("phone")} /></Field>
          <Field label="Salary"><Input type="number" step="0.01" {...register("salary")} /></Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Add employee
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
