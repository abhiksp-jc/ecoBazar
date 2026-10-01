import {
  useOutletContext,
  useNavigate,
  useParams,
  Link
} from "react-router-dom";
 
import { ArrowLeft } from "lucide-react";

import StaffForm from "../../components/staff/StaffForm";

const StaffFormPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    user,
    staff,
    onCreateStaff,
    onUpdateStaff
  } = useOutletContext();

  const isEdit = Boolean(id);

  const currentStaff = staff.find(
    (item) => item._id === id
  );

 
  if (user?.role !== "ADMIN") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        Access denied.
      </div>
    );
  }

  if (isEdit && !currentStaff) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">

        <h2 className="font-semibold text-red-600">
          Staff member not found
        </h2>

        <Link
          to="/staff"
          className="mt-4 inline-flex text-sm font-medium text-green-700"
        >
          Back to Staff
        </Link>

      </div>
    );
  }

  const handleSubmit = async (data) => {
    if (isEdit) {
      await onUpdateStaff(id, data);
    } else {
      await onCreateStaff(data);
    }
  };

  return (
    <div>

      <div className="mb-6 flex items-center gap-3">

        <Link
          to="/staff"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Staff" : "Add Staff"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {isEdit
              ? "Update staff information and permissions"
              : "Create a staff account and assign permissions"}
          </p>
        </div>

      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">

        <StaffForm
          staff={currentStaff || null}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/staff")}
          loading={false}
        />

      </div>

    </div>
  );
};

export default StaffFormPage;