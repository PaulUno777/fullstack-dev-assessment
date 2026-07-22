# frozen_string_literal: true

require "test_helper"

class Candidates::StatusPolicyTest < ActiveSupport::TestCase
  test "pending to accepted is allowed and marks reviewed" do
    result = Candidates::StatusPolicy.apply(current_status: "pending", new_status: "accepted")

    assert result.ok?
    assert_equal true, result.reviewed
  end

  test "pending to rejected is allowed" do
    result = Candidates::StatusPolicy.apply(current_status: "pending", new_status: "rejected")

    assert result.ok?
  end

  test "accepted status is locked" do
    result = Candidates::StatusPolicy.apply(current_status: "accepted", new_status: "rejected")

    assert_not result.ok?
    assert_equal :status_locked, result.error_code
  end

  test "rejected status is locked" do
    result = Candidates::StatusPolicy.apply(current_status: "rejected", new_status: "accepted")

    assert_not result.ok?
    assert_equal :status_locked, result.error_code
  end

  test "invalid status is rejected" do
    result = Candidates::StatusPolicy.apply(current_status: "pending", new_status: "unknown")

    assert_not result.ok?
    assert_equal :invalid_status, result.error_code
  end
end
